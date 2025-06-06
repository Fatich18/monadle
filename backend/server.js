// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// ---------- 1. MongoDB Bağlantısı ----------

const mongoUri = process.env.MONGO_URI; // örn: mongodb://localhost:27017/monadle
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', err => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('MongoDB connected'));

// ---------- 2. Şema ve Modeller ----------

const DailyWordSchema = new mongoose.Schema({
  date: { type: String, unique: true },  // YYYY-MM-DD
  word: String
});
const DailyWord = mongoose.model('DailyWord', DailyWordSchema);

const GuessSchema = new mongoose.Schema({
  date: String,            // YYYY-MM-DD
  fid: String,             // Farcaster ID
  guess: String,           // Kullanıcının tahmini (uppercase)
  correct: Boolean,        // Doğru mu?
  timestamp: Number        // Unix ms
});
const Guess = mongoose.model('Guess', GuessSchema);

// ---------- 3. Yardımcı Fonksiyonlar ----------

// 3.1. Bugünün Tarihi (UTC) Formatı: YYYY-MM-DD
function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

// 3.2. Rastgele Kelime Seçme
async function pickDailyWord(length) {
  // Eğer zaten o güne ait kelime varsa onu döndür
  const today = getTodayDate();
  let record = await DailyWord.findOne({ date: today });
  if (record) return record.word;

  // Sözlük dosyasından (words.json) filtreleyip rastgele seç
  const words = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'words.json'))
  );
  const filtered = words.filter(w => w.length === length);
  if (filtered.length === 0) throw new Error('No words of that length');
  const randomWord = filtered[Math.floor(Math.random() * filtered.length)].toUpperCase();

  // Veritabanına kaydet
  record = new DailyWord({ date: today, word: randomWord });
  await record.save();
  return randomWord;
}

// 3.3. Harf Değerlendirme Fonksiyonu
function evaluateGuess(guess, secretWord) {
  const evaluation = [];
  const secretArr = secretWord.split('');
  const guessArr = guess.split('');
  const used = Array(secretArr.length).fill(false);

  // 1. Tur: Doğru pozisyonlar
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === secretArr[i]) {
      evaluation[i] = 'correct';
      used[i] = true;
    }
  }
  // 2. Tur: Yanlış pozisyondaki doğru harfler
  for (let i = 0; i < guessArr.length; i++) {
    if (evaluation[i]) continue;
    const idx = secretArr.findIndex((c, j) => c === guessArr[i] && !used[j]);
    if (idx !== -1) {
      evaluation[i] = 'present';
      used[idx] = true;
    } else {
      evaluation[i] = 'absent';
    }
  }
  // Doğru mu?
  const correct = guess === secretWord;
  return { evaluation, correct };
}

// ---------- 4. REST API Endpoint’leri ----------

// 4.1. GET /api/get-word?length=5
app.get('/api/get-word', async (req, res) => {
  try {
    const length = parseInt(req.query.length);
    if (![3,4,5,6].includes(length)) {
      return res.status(400).json({ error: 'Invalid length' });
    }
    const word = await pickDailyWord(length);
    return res.json({ word }); // Örn: { word: "APPLE" }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 4.2. POST /api/submit-guess
/**
Body: {
  fid: string,
  guess: string,   // uppercase
  timestamp: number
}
*/
app.post('/api/submit-guess', async (req, res) => {
  try {
    const { fid, guess, timestamp } = req.body;
    const today = getTodayDate();

    // Günün kelimesini çek
    const record = await DailyWord.findOne({ date: today });
    if (!record) {
      return res.status(400).json({ error: 'Daily word not set' });
    }
    const secretWord = record.word; // Örn: “APPLE”

    // Doğrulama
    const { evaluation, correct } = evaluateGuess(guess, secretWord);

    // Tahmin kaydı
    const newGuess = new Guess({
      date: today,
      fid,
      guess,
      correct,
      timestamp
    });
    await newGuess.save();

    // Eğer kazanıldıysa, kazananı belirle ve token mantığını başlat
    if (correct) {
      // Örnek: İlk doğru tahmin eden kazanır
      const firstWinner = await Guess.findOne({ date: today, correct: true }).sort({ timestamp: 1 });
      if (firstWinner && firstWinner.fid === fid) {
        // Burada kazanan bildirimi/loglama yapılabilir
        console.log(`Winner today: ${fid}`);
        // Q: Token transferi nasıl yapacak? Frame üzerinden client tetikleyecek.
      }
    }

    return res.json({ evaluation, correct });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 4.3. Webhook Endpoint’i (Örnek olarak base sadece log tutar)
app.post('/webhook', async (req, res) => {
  console.log('Webhook event:', req.body);
  // Farcaster’dan gelen frame ekleme/çıkarma gibi event’ler buraya düşer.
  res.sendStatus(200);
});

// ---------- 5. Sunucuyu Başlat ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Monadle backend running on port ${PORT}`);
});
