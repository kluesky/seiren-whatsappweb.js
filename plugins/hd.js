import axios from 'axios';
import FormData from 'form-data';
import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;

async function enhanceImage(buffer) {
  const form = new FormData();
  form.append('method', '1');
  form.append('is_pro_version', 'false');
  form.append('is_enhancing_more', 'false');
  form.append('max_image_size', 'medium');
  form.append('file', buffer, `img_${Date.now()}.jpg`);

  const response = await axios.post('https://ihancer.com/api/enhance', form, {
    headers: {
      ...form.getHeaders(),
      'accept-encoding': 'gzip',
      'user-agent': 'Dart/3.5 (dart:io)'
    },
    responseType: 'arraybuffer'
  });

  return Buffer.from(response.data);
}

export default function HDPlugin(client) {
  client.on('message', async msg => {
    if (!msg.body.toLowerCase().startsWith('.hd')) return;

    const q = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;

    if (!q.hasMedia) {
      return msg.reply('❌ Kirim atau balas gambar dengan *.hd*');
    }

    try {
      await msg.reply('⏳ Meng-enhance gambar...');

      const media = await q.downloadMedia();
      const buffer = Buffer.from(media.data, 'base64');

      const enhancedBuffer = await enhanceImage(buffer);
      const enhancedMedia = new MessageMedia(
        'image/jpeg',
        enhancedBuffer.toString('base64'),
        'enhanced.jpg'
      );

      await msg.reply(enhancedMedia, null, {
        caption: '✅ Gambar berhasil di-enhance!'
      });

    } catch (err) {
      console.error('[HD Plugin Error]', err);
      msg.reply(`❌ Gagal enhance gambar:\n${err.message}`);
    }
  });
}
