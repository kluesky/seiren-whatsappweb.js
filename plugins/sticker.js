// sticker.js

export default function StickerPlugin(client) {
  client.on('message', async (msg) => {
    const isStickerCmd = msg.body.toLowerCase() === '.s';

    if (isStickerCmd && msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();

      if (quotedMsg.hasMedia) {
        const media = await quotedMsg.downloadMedia();

        if (!media) {
          await msg.reply('⚠️ Gagal mengunduh media.');
          return;
        }

        await client.sendMessage(msg.from, media, {
          sendMediaAsSticker: true,
          stickerName: 'Instagram : @me_kyluesky',
          stickerAuthor: 'Bot ESM',
        });
      } else {
        await msg.reply('❌ Balas gambar atau video untuk dijadikan stiker.');
      }
    } else if (isStickerCmd) {
      await msg.reply('❌ Gunakan perintah ini dengan membalas gambar atau video.');
    }
  });
}
