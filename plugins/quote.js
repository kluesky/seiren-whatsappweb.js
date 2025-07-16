// quote.js

const quotes = [
  "🌟 *Jangan menyerah!* Hal besar butuh waktu dan usaha.",
  "🚀 *Kesuksesan* bukan tujuan akhir, tapi proses belajar tanpa henti.",
  "📘 *Ilmu adalah cahaya,* teruslah belajar dan berbagi.",
  "🔥 *Gagal itu biasa,* bangkit itu luar biasa.",
  "🧠 *Berpikir kritis* lebih penting dari menghafal.",
  "✨ *Semua hal besar* dimulai dari langkah pertama."
];

export default function QuotePlugin(client) {
  client.on('message', async (msg) => {
    if (msg.body.toLowerCase().trim() === '.quote') {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

      const styledReply = `
╭── *📢 Lyora*
│ Inspirasi Harian ✨
╰────────────────────

${randomQuote}
`;

      await msg.reply(styledReply);
    }
  });
}
