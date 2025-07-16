// say.js

export default function SayPlugin(client) {
  client.on('message', async (msg) => {
    const body = msg.body.trim();

    // Hanya lanjut jika diawali .say dan ada isi pesannya
    if (body.toLowerCase().startsWith('.say')) {
      const content = body.slice(4).trim();

      if (!content) {
        await msg.reply('💬 Contoh penggunaan: `.say Halo semua!`');
        return;
      }

      // Kirim kembali teks sebagai bot
      await msg.reply(`🗣️ ${content}`);
    }
  });
}
