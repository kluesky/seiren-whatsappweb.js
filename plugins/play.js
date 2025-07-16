import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yts from 'yt-search';
import ffmpegPath from 'ffmpeg-static';
import wweb from 'whatsapp-web.js';
import ytdlExec from 'youtube-dl-exec';

// Konversi __dirname untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ekstrak dari CommonJS
const { MessageMedia } = wweb;
const exec = ytdlExec;

// Plugin
export default function YTPlayPlugin(client) {
  const sessions = {};

  client.on('message', async msg => {
    const text = msg.body.trim();

    // Pemilihan lagu dari list
    if (/^[1-5]$/.test(text) && sessions[msg.from]) {
      const choice = parseInt(text) - 1;
      const video = sessions[msg.from][choice];
      delete sessions[msg.from];

      await msg.reply(`🎧 Mengunduh: *${video.title}*`);

      try {
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const fileName = `audio_${Date.now()}.mp3`;
        const filePath = path.join(tempDir, fileName);

        const ytdlOptions = {
          extractAudio: true,
          audioFormat: 'mp3',
          audioQuality: 0,
          output: filePath,
          ffmpegLocation: ffmpegPath
        };

        await exec(video.url, ytdlOptions);

        const audio = fs.readFileSync(filePath, 'base64');
        const media = new MessageMedia('audio/mpeg', audio, fileName);

        await msg.reply(media, null, {
          caption: `🎵 ${video.title}`
        });

        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('[YTPlay Error]', err);
        msg.reply('❌ Gagal memutar lagu.');
      }
      return;
    }

    // Jika bukan perintah .play
    if (!text.startsWith('.play ')) return;

    const query = text.slice(6).trim();
    if (!query) return msg.reply('❌ Masukkan judul lagu.');

    await msg.reply(`🔎 Mencari lagu: *${query}*...`);

    try {
      const results = await yts(query);
      const top5 = results.videos.slice(0, 5);

      if (!top5.length) return msg.reply('❌ Lagu tidak ditemukan.');

      let list = top5.map((v, i) => `*${i + 1}.* ${v.title} (${v.timestamp})`).join('\n');
      list += `\n\n📝 Balas dengan angka (1–${top5.length}) untuk memilih.`;

      sessions[msg.from] = top5;
      await msg.reply(list);
    } catch (err) {
      console.error('[YTSearch Error]', err);
      msg.reply('❌ Gagal mencari lagu.');
    }
  });
}
