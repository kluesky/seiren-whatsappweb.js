export default function EveryoneCommand(client) {
  client.on('message', async (msg) => {
    if (msg.body.startsWith('.tagall')) {
      // Gunakan pengecekan ID grup
      if (!msg.from.endsWith('@g.us')) {
        return msg.reply('❌ Perintah ini hanya bisa digunakan di dalam grup.');
      }

      try {
        const chat = await msg.getChat();
        const participants = await chat.participants;

        const mentions = participants.map(p => p.id._serialized);
        const mentionText = participants.map(p => `@${p.id.user}`).join(' ');

        const messageText = msg.body.slice(9).trim(); // ambil pesan tambahan
        const finalMessage = `📣 *Tag Semua!*\n${messageText ? messageText + '\n\n' : ''}${mentionText}`;

        await chat.sendMessage(finalMessage, {
          mentions: mentions,
        });

      } catch (e) {
        console.error('[EVERYONE ERROR]', e);
        msg.reply('❌ Gagal melakukan tag semua anggota.');
      }
    }
  });
}
