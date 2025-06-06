import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    redirect: {
      url: 'https://monadle-frame.vercel.app', // oyun sayfanın linki
    },
  });
}
