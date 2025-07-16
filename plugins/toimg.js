import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import wweb from 'whatsapp-web.js';

const { MessageMedia } = wweb;

// Untuk dapatkan __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function ToImgPlugin(client) {
  client.on('message', async (msg) => {
    if (!msg.body.startsWith('.toimg')) return;

    if (!msg.hasQuotedMsg) {
      return msg.reply('❌ Balas stiker dengan perintah *.toimg*');
    }

    const quoted = await msg.getQuotedMessage();
    const mime = quoted?._data?.mimetype;

    if (!mime || !mime.includes('webp')) {
      return msg.reply('❌ Pesan yang dibalas bukan stiker/webp.');
    }

    try {
      const media = await quoted.downloadMedia();
      const webpBuffer = Buffer.from(media.data, 'base64');

      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

      const id = Date.now();
      const webpPath = path.join(tempDir, `sticker-${id}.webp`);
      const jpgPath = path.join(tempDir, `converted-${id}.jpg`);

      fs.writeFileSync(webpPath, webpBuffer);

      await sharp(webpPath)
        .jpeg()
        .toFile(jpgPath);

      const jpgBuffer = fs.readFileSync(jpgPath);
      const jpgBase64 = jpgBuffer.toString('base64');
      const image = new MessageMedia('image/jpeg', jpgBase64, 'image.jpg');

      await msg.reply(image);

      fs.unlinkSync(webpPath);
      fs.unlinkSync(jpgPath);
    } catch (err) {
      console.error('[ToImg Error]', err);
      msg.reply('❌ Gagal mengonversi stiker ke gambar.');
    }
  });
}
