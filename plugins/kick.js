export default function KickPlugin(client) {
  client.on('message', async (msg) => {
    if (msg.body.startsWith('.kick')) {
      // Pastikan perintah dijalankan di grup
      if (!msg.from.endsWith('@g.us')) {
        return msg.reply('❌ Perintah ini hanya bisa digunakan di dalam grup.');
      }

      const chat = await msg.getChat();
      const sender = msg.author || msg.from; // msg.author hanya ada di grup

      // Pastikan pengirim adalah admin
      const senderIsAdmin = chat.participants.find(p => p.id._serialized === sender && p.isAdmin);
      if (!senderIsAdmin) {
        return msg.reply('❌ Hanya admin yang dapat menggunakan perintah ini.');
      }

      // Pastikan bot juga admin
      const botNumber = client.info.wid._serialized;
      const botIsAdmin = chat.participants.find(p => p.id._serialized === botNumber && p.isAdmin);
      if (!botIsAdmin) {
        return msg.reply('❌ Bot harus menjadi admin untuk mengeluarkan anggota.');
      }

      const mentioned = msg.mentionedIds;

      if (!mentioned.length) {
        return msg.reply('❌ Tag user yang ingin dikeluarkan.\nContoh: `.kick @user`');
      }

      for (const userId of mentioned) {
        const isAdmin = chat.participants.find(p => p.id._serialized === userId && p.isAdmin);
        if (isAdmin) {
          await msg.reply(`⚠️ Tidak bisa mengeluarkan admin: @${userId.split('@')[0]}`, {
            mentions: [userId]
          });
        } else {
          await chat.removeParticipants([userId]);
          await msg.reply(`✅ Berhasil mengeluarkan: @${userId.split('@')[0]}`, {
            mentions: [userId]
          });
        }
      }
    }
  });
}
