import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import settings from './settings.js';
import AntiSpamPlugin from './antispam.js';





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const client = new Client();
client.initialize();


class WhatsAppBot {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: path.join(__dirname, '../session') }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        executablePath: process.env.CHROME_PATH || (
          process.platform === 'win32'
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            : 'google-chrome-stable'
        )
      }
    });
  }

  async loadPlugins() {
    const pluginsDir = path.join(__dirname, '../plugins');

    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir);
      console.log(chalk.yellowBright('[System] Folder plugins dibuat'));
      return;
    }

    const loadPluginFile = async (file) => {
      const pluginPath = path.join(pluginsDir, file);
      try {
        const pluginModule = await import(`file://${pluginPath}?update=${Date.now()}`);
        if (typeof pluginModule.default === 'function') {
          pluginModule.default(this.client);
          console.log(chalk.greenBright(`[Plugin] ${file} dimuat ulang`));
        } else {
          console.warn(chalk.red(`[Plugin] ${file} tidak valid`));
        }
      } catch (err) {
        console.error(chalk.red(`[Plugin Error] ${file}: ${err.message}`));
      }
    };

    const pluginFiles = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
    for (const file of pluginFiles) {
      await loadPluginFile(file);
    }

    const watcher = chokidar.watch(pluginsDir, { ignoreInitial: true });

    watcher.on('add', file => {
      const filename = path.basename(file);
      if (filename.endsWith('.js')) {
        console.log(chalk.blueBright(`[Watcher] Plugin baru: ${filename}`));
        loadPluginFile(filename);
      }
    });

    watcher.on('change', file => {
      const filename = path.basename(file);
      if (filename.endsWith('.js')) {
        console.log(chalk.magentaBright(`[Watcher] Plugin diperbarui: ${filename}`));
        loadPluginFile(filename);
      }
    });

    watcher.on('unlink', file => {
      const filename = path.basename(file);
      console.log(chalk.gray(`[Watcher] Plugin dihapus: ${filename}`));
    });
  }

  setupMessageLogging() {
    this.client.on('message', async msg => {
      try {
        // ✅ AUTO READ menggunakan client.sendSeen
        await this.client.sendSeen(msg.from);

        const log = {
          time: new Date().toLocaleString(),
          from: msg.from,
          type: msg.type,
          isGroup: msg.from.endsWith('@g.us'),
          isViewOnce: msg.isViewOnce,
          body: msg.body?.slice(0, 50) + (msg.body?.length > 50 ? '...' : '')
        };

        console.log(chalk.cyanBright(`📩 [Pesan] ${log.time} | ${log.from} | ${log.type} | Group: ${log.isGroup}`));
        if (log.body) console.log(chalk.gray(`   ➤ ${log.body}`));

        if (msg.isViewOnce && msg.hasMedia) {
          const media = await msg.downloadMedia();
          if (media) {
            const mediaDir = path.join(__dirname, '../media');
            if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

            const ext = media.mimetype.split('/')[1];
            const fileName = `viewonce-${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(mediaDir, fileName), media.data, 'base64');

            console.log(chalk.yellow(`💾 ViewOnce media disimpan: ${fileName}`));
          }
        }
      } catch (err) {
        console.error(chalk.red('[Logging Error]'), err);
      }
    });
  }

  async start() {
    this.client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
      console.log(chalk.blue('\n[System] 🔐 Silakan scan QR Code di atas dengan WhatsApp.'));
    });

    this.client.on('ready', () => {
      console.log(`🤖 ${settings.botName} v${settings.version} berjalan...`);
      this.setupMessageLogging();
      this.loadPlugins();
    });

    this.client.on('disconnected', reason => {
      console.log(chalk.redBright('[System] ❌ Koneksi terputus:'), reason);
      setTimeout(() => this.client.initialize(), 5000);
    });

    this.client.on('auth_failure', msg => {
      console.error(chalk.red('[Auth Error] Autentikasi gagal:'), msg);
    });

    try {
      await this.client.initialize();
    } catch (err) {
      console.error(chalk.red('[Init Error] Gagal memulai bot:'), err.message);
      setTimeout(() => this.start(), 10000);
    }
  }
}

new WhatsAppBot().start().catch(err => {
  console.error(chalk.red('[Fatal] Error utama:'), err);
  process.exit(1);
});