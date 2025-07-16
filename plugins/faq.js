// faq.js

const faqList = [
  {
    keyword: ['reset password', 'lupa password', 'ganti password'],
    answer: `🔐 Untuk mereset password:\n1. Kunjungi halaman reset: https://reset.akun.esm.local\n2. Masukkan email kantor\n3. Ikuti instruksi yang dikirim via email`,
  },
  {
    keyword: ['vpn', 'akses vpn', 'login vpn'],
    answer: `🌐 Untuk mengakses VPN:\n1. Pastikan sudah install OpenVPN\n2. Jalankan file konfigurasi yang diberikan oleh IT\n3. Login menggunakan akun domain`,
  },
  {
    keyword: ['email tidak bisa masuk', 'email error', 'email gagal'],
    answer: `📧 Jika email gagal masuk:\n1. Periksa koneksi internet\n2. Cek penyimpanan email penuh\n3. Hubungi support jika masih bermasalah`,
  },
  {
    keyword: ['wifi kantor', 'jaringan lambat', 'internet lemot'],
    answer: `📡 Jika jaringan kantor lambat:\n• Coba restart perangkat\n• Gunakan jaringan ESM-WiFi\n• Lapor ke IT jika terus terjadi`,
  },
  {
    keyword: ['jam kerja', 'pukul berapa', 'waktu kerja'],
    answer: `🕒 Jam kerja ESM:\nSenin–Jumat: 08.00 – 17.00 WIB\nSabtu & Minggu: Libur`,
  },
];

export default function FaqPlugin(client) {
  client.on('message', async (msg) => {
    if (msg.body.toLowerCase().startsWith('.tanya')) {
      const query = msg.body.slice(6).toLowerCase().trim();

      if (!query) {
        await msg.reply('❓ Contoh: `.tanya bagaimana cara reset password`');
        return;
      }

      const match = faqList.find(faq =>
        faq.keyword.some(k => query.includes(k))
      );

      if (match) {
        await msg.reply(match.answer);
      } else {
        await msg.reply('🤖 Maaf, saya belum punya jawaban untuk itu.\nSilakan hubungi tim IT atau ketik ulang dengan pertanyaan yang lebih jelas.');
      }
    }
  });
}
