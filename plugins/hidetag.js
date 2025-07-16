export default function HidetagPlugin(client) {
  client.on('message', async (msg) => {
    if (!msg.body.startsWith('.hidetag')) return;

    // Ambil isi pesan setelah perintah
    const text = msg.body.slice(8).trim();

    try {
      const chat = await msg.getChat();

      // Pastikan ini dari grup
      if (!chat.isGroup) {
        return msg.reply('❌ Perintah ini hanya bisa digunakan di grup.');
      }

      const participants = await chat.participants;
      const mentions = participants.map(p => p.id._serialized);

      if (!text) {
        return msg.reply('❌ Mohon isi teks setelah perintah. Contoh: .hidetag Halo semua!');
      }

      await client.sendMessage(chat.id._serialized, text, {
        mentions
      });

    } catch (e) {
      console.error('[HIDETAG ERROR]', e);
      msg.reply('❌ Terjadi kesalahan saat menjalankan perintah hidetag.');
    }
  });
}
