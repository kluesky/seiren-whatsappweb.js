import os from 'os';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Jakarta');

export default function PingPlugin(client) {
  const startTime = Date.now();

  client.on('message', async (msg) => {
    if (msg.body === '.ping') {
      try {
        const start = Date.now();
        const replyMsg = await msg.reply('🔍 Cek koneksi...');
        const end = Date.now();
        const latency = end - start;

        const uptimeMs = Date.now() - startTime;
        const uptime = moment.duration(uptimeMs).humanize();
        const time = moment().format('DD/MM/YYYY HH:mm:ss');

        const chats = await client.getChats();
        const groups = chats.filter(c => c.isGroup);
        const contacts = await client.getContacts();
        const info = client.info;

        const report = `*✅ Bot Aktif!*

🏓 *Latency:* ${latency}ms
🕒 *Waktu Server:* ${time}
⏳ *Uptime:* ${uptime}
📁 *Total Chat:* ${chats.length}
👥 *Total Kontak:* ${contacts.length}
👨‍👩‍👧‍👦 *Group:* ${groups.length}
💻 *Platform:* ${os.platform()}
🖥️ *Node.js:* ${process.version}
🌐 *WhatsApp Web:* v${info?.waVersion || '-'}
`.trim();

        await replyMsg.reply(report);

      } catch (err) {
        console.error('[PING ERROR]', err);
        msg.reply('❌ Terjadi kesalahan saat mengambil data ping.');
      }
    }
  });
}
