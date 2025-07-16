// antispam.js

const userCooldowns = new Map();
const COOLDOWN_MS = 5000; // 5 detik

export default function AntiSpamPlugin(client) {
  client.on('message', async (msg) => {
    const sender = msg.fromMe ? 'bot' : (msg.author || msg.from);
    const now = Date.now();

    // Ambil waktu terakhir user kirim pesan
    const lastTime = userCooldowns.get(sender) || 0;
    const timePassed = now - lastTime;

    if (timePassed < COOLDOWN_MS) {
      const waitSec = ((COOLDOWN_MS - timePassed) / 1000).toFixed(1);
      console.log(`[AntiSpam] ${sender} blocked. Wait ${waitSec}s.`);
      await msg.reply(`⚠️ Kamu terlalu cepat! Tunggu ${waitSec} detik.`);
      return; // ⚠️ STOP! Jangan teruskan ke fitur lain
    }

    // Simpan waktu saat ini sebagai waktu terakhir kirim pesan
    userCooldowns.set(sender, now);
  });
}
