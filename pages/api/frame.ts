import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    og: {
      title: 'Monad Wordle',
      description: 'Stake to play and win MONAD!',
      image: 'https://monadle-frame.vercel.app/og.png', // kendi görsel URL'inle değiştir
    },
    buttons: [
      {
        label: 'Start',
        action: {
          type: 'post',
          url: 'https://monadle-frame.vercel.app/api/start', // kendi domain'inle değiştir
        },
      },
    ],
  });
}
