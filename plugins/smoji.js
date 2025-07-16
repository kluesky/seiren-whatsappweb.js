// stickerEmoji.js

import fetch from 'node-fetch';
import sharp from 'sharp';
import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;

export default function StickerEmojiPlugin(client) {
  client.on('message', async (msg) => {
    const body = msg.body.trim();
    const isCmd = body.toLowerCase().startsWith('.sticker ');

    if (isCmd) {
      const emoji = body.slice(8).trim();

      // Validasi emoji
      if (!emoji || emoji.length > 2) {
        await msg.reply('❌ Gunakan satu emoji saja. Contoh: `.sticker 😎`');
        return;
      }

      try {
        // Konversi emoji ke kode unicode
        const codePoints = Array.from(emoji)
          .map((char) => char.codePointAt(0).toString(16))
          .join('-');

        const emojiUrl = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codePoints}.png`;

        const res = await fetch(emojiUrl);
        if (!res.ok) throw new Error('Emoji tidak ditemukan');

        const buffer = await res.buffer();

        // Resize agar pas dengan stiker WhatsApp
        const stickerBuffer = await sharp(buffer)
          .resize(512, 512)
          .webp()
          .toBuffer();

        const media = new MessageMedia('image/webp', stickerBuffer.toString('base64'));

        await client.sendMessage(msg.from, media, {
          sendMediaAsSticker: true,
           stickerName: 'Instagram : @me_kyluesky',
          stickerAuthor: 'Bot ESM',
        });
      } catch (err) {
        console.error(err);
        await msg.reply('⚠️ Gagal membuat stiker dari emoji.');
      }
    }
  });
}
