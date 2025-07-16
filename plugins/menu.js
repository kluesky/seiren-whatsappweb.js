export default function MenuPlugin(client) {
  client.on('message', async (msg) => {
    if (msg.body === '.menu') {
      const teks = `
╭───〈  📜 ᴍᴇɴᴜ  〉───
│
├─── 📥 *Downloader*
│ • .tiktok <link> — TikTok no WM
│ • .ig <link> — Instagram Downloader
│ • .ytmp3 <link> — YouTube MP3
│ • .ytmp4 <link> — YouTube MP4
│
├─── ⏰ *Jadwal*
│ • .sholat <kota> — Jadwal Sholat
│
├─── ⚙️ *Utility*
│ • .ping — Cek respon bot & uptime
│ • .owner — Kontak pemilik bot
│ • .menu — Menampilkan menu
│ • .gcinfo — Info grup
│
├─── 🕹️ *Game RPG*
│ • .profile — Cek status RPG
│ • .daily — Ambil hadiah harian
│ • .hunt — Berburu monster
│ • .mine — Menambang resource
│ • .inventory — Lihat tas
│ • .equip <item> — Gunakan item
│ • .craft <item> — Craft item langka
│ • .party create|join|leave — Sistem party
│ • .pvp <tag> — PvP antar pemain
│
├─── 🛒 *RPG: Toko & Skill*
│ • .shop — Buka toko item
│ • .buy <item> — Beli item
│ • .skills — Daftar skill aktif
│ • .use <skill> — Gunakan skill
│
├─── 🗺️ *RPG: Dungeon & Crafting*
│ • .dungeon — Masuk dungeon
│ • .forge — Crafting senjata
│ • .rareitem — Cek item langka
│
├─── 🌐 *Portofolio*
│ • Website: https://lyora.netlify.app/
│
╰────〈 📦 Lyora Project 〉────
`;
      await msg.reply(teks);
    }
  });
}
