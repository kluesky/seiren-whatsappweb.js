// brat.js

import { createCanvas } from 'canvas';
import sharp from 'sharp';
import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;

export default function BratStickerPlugin(client) {
  client.on('message', async (msg) => {
    const body = msg.body.trim();
    if (!body.toLowerCase().startsWith('.brat')) return;

    const text = body.slice(5).trim();
    if (!text) {
      await msg.reply('❌ Contoh: `.brat Kamu jelek banget!`');
      return;
    }

    try {
      const width = 512;
      const height = 512;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // ⬜ Background putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Teks hitam
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = wrapText(ctx, text, width - 40);
      const lineHeight = 42;
      const totalHeight = lines.length * lineHeight;
      let startY = (height - totalHeight) / 2;

      lines.forEach((line) => {
        ctx.fillText(line, width / 2, startY);
        startY += lineHeight;
      });

      const buffer = canvas.toBuffer('image/png');
      const stickerBuffer = await sharp(buffer).resize(512, 512).webp().toBuffer();

      const media = new MessageMedia('image/webp', stickerBuffer.toString('base64'));

      await client.sendMessage(msg.from, media, {
        sendMediaAsSticker: true,
        stickerName: 'BRAT Mode',
        stickerAuthor: 'SeirenBot',
      });
    } catch (e) {
      console.error(e);
      await msg.reply('⚠️ Gagal membuat stiker brat.');
    }
  });
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}
