// link.js

export default function LinkPlugin(client) {
  client.on('message', async (msg) => {
    if (!msg.body.startsWith('.link')) return;

    const chat = await msg.getChat();
    if (!chat.isGroup) {
      return msg.reply('❌ Perintah ini hanya bisa digunakan di grup.');
    }

    const botNumber = client.info.wid._serialized;

    // Cek apakah bot adalah admin grup
    const isBotAdmin = chat.participants.some(
      (p) => p.id._serialized === botNumber && p.isAdmin
    );

    if (!isBotAdmin) {
      return msg.reply('🚫 Bot harus menjadi admin untuk mengambil link grup.');
    }

    try {
      const inviteCode = await chat.getInviteCode(); // ← PERUBAHAN UTAMA DI SINI
      const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
      await msg.reply(`🔗 Link grup:\n${inviteLink}`);
    } catch (err) {
      console.error(err);
      msg.reply('⚠️ Gagal mendapatkan link grup. Pastikan bot adalah admin.');
    }
  });
}
