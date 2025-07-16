// ss.js

import puppeteer from 'puppeteer';
import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;

export default function ScreenshotPlugin(client) {
  client.on('message', async (msg) => {
    const body = msg.body.trim();
    if (!body.startsWith('.ss ')) return;

    const url = body.slice(4).trim();

    if (!url || !url.startsWith('http')) {
      await msg.reply('❌ Masukkan URL yang valid. Contoh: `.ss https://example.com`');
      return;
    }

    await msg.reply('📸 Mengambil screenshot...');

    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const screenshot = await page.screenshot({ fullPage: true });
      await browser.close();

      const media = new MessageMedia('image/png', screenshot.toString('base64'));

      await client.sendMessage(msg.from, media, {
        caption: `✅ Screenshot dari:\n${url}`,
      });
    } catch (err) {
      console.error(err);
      await msg.reply('⚠️ Gagal mengambil screenshot. Coba lagi atau pastikan URL valid.');
    }
  });
}
