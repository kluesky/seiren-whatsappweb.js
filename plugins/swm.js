import fs from 'fs';
import path from 'path';
import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;

export default function SwmPlugin(client) {
  client.on('message', async (msg) => {
    if (!msg.body.startsWith('.swm')) return;

    const args = msg.body.slice(4).trim().split('|');
    const packname = args[0]?.trim() || '';
    const author = args[1]?.trim() || '';

    const quoted = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;

    if (!quoted || !quoted.hasMedia) {
      return msg.reply('❌ Balas foto atau video maksimal 10 detik dengan format:\n.swm packname | author');
    }

    try {
      const media = await quoted.downloadMedia();

      if (!media) return msg.reply('❌ Gagal mengunduh media.');

      if (media.mimetype.startsWith('video/') && quoted.duration > 10) {
        return msg.reply('🚩 Durasi video maksimal 10 detik.');
      }

      const sticker = new MessageMedia(media.mimetype, media.data, media.filename);

      await client.sendMessage(msg.from, sticker, {
        sendMediaAsSticker: true,
        stickerAuthor: author,
        stickerName: packname,
        stickerCategories: ['🤖']
      });

    } catch (err) {
      console.error('[SWM ERROR]', err);
      msg.reply('❌ Terjadi kesalahan saat membuat stiker.');
    }
  });
}
