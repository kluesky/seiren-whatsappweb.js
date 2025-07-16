// rvo.js

import { readFileSync as read, unlinkSync as remove, writeFileSync as create } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mime from 'mime-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function RVOPlugin(client) {
  client.on('message', async (msg) => {
    if (!msg.body.startsWith('.rvo')) return;
    if (!msg.hasQuotedMsg) return msg.reply('🚩 Reply ke pesan sekali lihat untuk membuka.');

    try {
      const quoted = await msg.getQuotedMessage();
      if (!quoted.isViewOnce) return msg.reply('🚩 Pesan ini bukan "view once".');

      await msg.react('🕒');

      const media = await quoted.downloadMedia();
      if (!media) return msg.reply('⚠️ Gagal mengambil media.');

      const buffer = Buffer.from(media.data, 'base64');
      const mimetype = media.mimetype || mime.lookup(media.filename || '') || '';

      if (mimetype.startsWith('image/') || mimetype.startsWith('video/')) {
        await client.sendMessage(msg.from, buffer, {
          caption: quoted.body || '',
          quotedMessageId: msg.id._serialized,
        });
      } else if (mimetype.startsWith('audio/')) {
        const tempInput = path.join(tmpdir(), 'audio_input.mp3');
        const tempOutput = path.join(tmpdir(), 'audio_output.mp3');
        create(tempInput, buffer);

        exec(
          `ffmpeg -i "${tempInput}" -vn -ar 44100 -ac 2 -b:a 128k "${tempOutput}"`,
          async (err) => {
            if (err) {
              remove(tempInput);
              return msg.reply('🚩 Gagal mengonversi audio.');
            }

            const output = read(tempOutput);
            await client.sendMessage(msg.from, output, {
              sendAudioAsVoice: false,
              mimetype: 'audio/mp4',
              filename: 'audio.mp3',
              quotedMessageId: msg.id._serialized,
            });

            remove(tempInput);
            remove(tempOutput);
          }
        );
      } else {
        await msg.reply('⚠️ Jenis file tidak didukung.');
      }
    } catch (err) {
      console.error(err);
      msg.reply(`❌ Terjadi kesalahan:\n${err.message}`);
    }
  });
}
