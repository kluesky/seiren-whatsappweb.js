<h1 align="center">🤖 Seiren WhatsApp Bot</h1>
<p align="center">
  <img src="https://img.shields.io/github/stars/kluesky/seiren-whatsappweb.js?style=flat-square" />
  <img src="https://img.shields.io/github/license/kluesky/seiren-whatsappweb.js?style=flat-square" />
  <img src="https://img.shields.io/github/languages/top/kluesky/seiren-whatsappweb.js?style=flat-square" />
</p>

<p align="center">
  <b>✨ WhatsApp multipurpose bot berbasis <code>whatsapp-web.js</code>.</b><br>
  <b>🎮 Dirancang untuk hiburan, AI, game, downloader, dan automasi — all-in-one!</b>
</p>

---

## 🚀 Fitur Utama

- ⚙️ Modular command handler dengan prefix `.`
- 🎵 Unduh lagu YouTube dengan `.play` (auto delete button-loc)
- 📥 Downloader TikTok, Instagram (Reels/Story), Twitter, Otakudesu
- 🎮 Gacha Waifu, PvP Waifu Battle, Tebak Lagu Anime, Suara Karakter
- 💬 TalkWithWaifu — interaktif dengan mood & suara karakter anime
- 🧠 Integrasi AI: Google Gemini, Voice Generator, Chat Assistant
- 🌐 Interkoneksi Telegram & WhatsApp
- 📊 Fitur owner: Spylog, IP Tracker, Log Aktivitas, Stat Tracker
- 🤖 Auto-reply, welcome group, anti toxic, auto-react

---

## 📦 Instalasi

> Butuh Node.js v18+ dan WhatsApp Web login (QR)

```bash
git clone https://github.com/kluesky/seiren-whatsappweb.js
cd seiren-whatsappweb.js
npm install
node index.js
```

Lalu scan QR dari WhatsApp Web saat diminta di terminal.

---

## 💡 Command Highlight

| Command       | Fungsi                              |
|---------------|-------------------------------------|
| `.play`       | Cari & unduh lagu dari YouTube      |
| `.tt`         | Downloader TikTok tanpa watermark   |
| `.ig`         | Downloader Reels / Story Instagram  |
| `.summon10`   | Gacha Waifu dengan efek suara       |
| `.waifubattle`| PvP waifu dengan sistem turn-based  |
| `.talkwaifu`  | Chat dengan AI waifu (suara + mood) |
| `.spylog`     | Cek aktivitas user bot secara real  |
| `.jadwalanime`| Lihat jadwal anime mingguan         |

---

## 🔐 API & Konfigurasi

Beberapa fitur butuh API key:

```env
GEMINI_API_KEY=your_google_gemini_key
LOLHUMAN_API_KEY=your_lolhuman_key
TIKWM_API_KEY=your_tikwm_key
```

> Buat file `.env` di root project dan isi dengan key kamu.

---

## ✨ Kontribusi

Pull Request sangat diterima! Kamu bisa bantu:
- Menambahkan command baru
- Menyempurnakan AI atau sistem mood
- Membuat integrasi dengan platform lain

Fork repo, buat branch baru, dan kirim PR-mu 💙

---

## 👤 Developer

- 💡 Author: [@kluesky](https://github.com/kluesky)
- 📸 Instagram: [@me_kyluesky](https://instagram.com/me_kyluesky)
- 💬 Waifu Project: `Seiren Beta`

---

## 📄 Lisensi

MIT License © 2025 — Seiren WhatsApp AI Project by `kluesky`