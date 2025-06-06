import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const frameHtml = `
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://i.imgur.com/I1E1g4V.png" />
        <meta property="fc:frame:button:1" content="Start Game" />
        <meta property="fc:frame:post_url" content="https://monadle.vercel.app/api/handle" />
      </head>
      <body></body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(frameHtml);
}
