// status.js

const statusMap = {
  server: {
    emoji: '🖥️',
    status: '✅ Server utama berjalan normal.\nTidak ada gangguan terdeteksi.',
    lastCheck: '2025-07-16 08:05 WIB',
  },
  jaringan: {
    emoji: '🌐',
    status: '⚠️ Terdapat gangguan minor pada koneksi lantai 3.\nTim IT sedang investigasi.',
    lastCheck: '2025-07-16 07:50 WIB',
  },
  email: {
    emoji: '📧',
    status: '✅ Layanan email aktif dan normal.',
    lastCheck: '2025-07-16 08:00 WIB',
  },
  vpn: {
    emoji: '🔒',
    status: '🚧 Layanan VPN dalam pemeliharaan hingga pukul 10:00 WIB.\nGunakan jaringan lokal sementara.',
    lastCheck: '2025-07-16 07:30 WIB',
  },
};

export default function StatusPlugin(client) {
  client.on('message', async (msg) => {
    if (msg.body.toLowerCase().startsWith('.status')) {
      const parts = msg.body.trim().split(' ');
      const category = parts[1]?.toLowerCase();

      if (!category || !statusMap[category]) {
        const available = Object.keys(statusMap).map((s) => `• ${s}`).join('\n');
        await msg.reply(`❌ Gunakan format: *.status <kategori>*\nKategori yang tersedia:\n${available}`);
        return;
      }

      const { emoji, status, lastCheck } = statusMap[category];
      await msg.reply(`${emoji} *Status ${category.toUpperCase()}*\n${status}\n\n🕒 Terakhir dicek: ${lastCheck}`);
    }
  });
}
