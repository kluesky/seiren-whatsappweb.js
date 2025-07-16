export default function OwnerPlugin(client) {
  client.on('message', async (msg) => {
    if (msg.body === '.owner') {
      try {
        const ownerNumber = '6281234567890'; // ganti nomor ownermu, tanpa + dan spasi

        const vcard =
`BEGIN:VCARD
VERSION:3.0
FN:Lyora
TEL;type=CELL;waid=${ownerNumber}:${ownerNumber.startsWith('62') ? '+' + ownerNumber : ownerNumber}
END:VCARD`;

        await client.sendMessage(msg.from, {
          contacts: [
            {
              displayName: 'Lyora',
              contacts: [{ vcard }]
            }
          ]
        }, { quoted: msg });

      } catch (e) {
        console.error(e);
        await msg.reply('❌ Terjadi kesalahan saat mengirim kontak owner.');
      }
    }
  });
}
