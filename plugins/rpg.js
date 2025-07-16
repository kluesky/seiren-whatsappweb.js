// File: plugins/rpg.js

const players = {};

function getPlayer(id) {
  if (!players[id]) {
    players[id] = {
      name: '',
      level: 1,
      exp: 0,
      hp: 100,
      gold: 50,
      weapon: 'Wooden Sword',
      skills: ['Slash'],
      inventory: [],
      lastDaily: 0,
      party: [],
      quests: {},
    };
  }
  return players[id];
}

export default function RPGPlugin(client) {
  client.on('message', async (msg) => {
    const body = msg.body.trim();
    const sender = msg.from;
    const player = getPlayer(sender);

    if (body === '.profile') {
      await msg.reply(
        `👤 *Profile RPG*
` +
        `🎖️ Nama: ${player.name || sender}
` +
        `📊 Level: ${player.level}
` +
        `⚔️ Exp: ${player.exp}
` +
        `❤️ HP: ${player.hp}
` +
        `💰 Gold: ${player.gold}
` +
        `🗡️ Weapon: ${player.weapon}
` +
        `🎯 Skills: ${player.skills.join(', ')}`
      );
    }

    if (body === '.daily') {
      const now = Date.now();
      if (now - player.lastDaily < 86400000) return msg.reply('❌ Kamu sudah klaim harian. Coba lagi besok.');
      player.gold += 100;
      player.lastDaily = now;
      msg.reply('✅ Kamu mendapatkan 100 gold dari klaim harian.');
    }

    if (body === '.adventure') {
      const damage = Math.floor(Math.random() * 20) + 10;
      player.hp -= damage;
      const expGain = Math.floor(Math.random() * 30) + 20;
      player.exp += expGain;
      if (player.hp <= 0) player.hp = 100;
      msg.reply(`🗺️ Kamu berpetualang dan mendapat ${expGain} exp, tetapi kehilangan ${damage} HP.`);
    }

    if (body === '.levelup') {
      if (player.exp >= player.level * 100) {
        player.exp -= player.level * 100;
        player.level++;
        player.hp = 100;
        msg.reply(`⬆️ Selamat! Kamu naik ke level ${player.level}`);
      } else {
        msg.reply(`❌ Exp kamu belum cukup untuk naik level.`);
      }
    }

    if (body === '.heal') {
      if (player.gold >= 20) {
        player.hp = 100;
        player.gold -= 20;
        msg.reply('🧪 Kamu menyembuhkan diri dengan 20 gold. HP penuh.');
      } else {
        msg.reply('❌ Gold kamu tidak cukup.');
      }
    }

    if (body === '.inventory') {
      msg.reply(`🎒 Inventory: ${player.inventory.join(', ') || 'Kosong'}`);
    }

    if (body.startsWith('.equip ')) {
      const weapon = body.slice(7);
      if (player.inventory.includes(weapon)) {
        player.weapon = weapon;
        msg.reply(`🗡️ Kamu kini menggunakan ${weapon}`);
      } else {
        msg.reply(`❌ Kamu tidak punya senjata itu.`);
      }
    }

    if (body === '.quest') {
      player.quests.monster = true;
      msg.reply('📜 Quest dimulai: Bunuh 3 monster');
    }

    if (body === '.claim') {
      if (player.quests.monster) {
        player.gold += 150;
        delete player.quests.monster;
        msg.reply('🎉 Quest selesai! Kamu dapat 150 gold.');
      } else {
        msg.reply('❌ Kamu belum menyelesaikan quest.');
      }
    }

    if (body.startsWith('.party ')) {
      const target = body.slice(7);
      if (!player.party.includes(target)) {
        player.party.push(target);
        msg.reply(`🧑‍🤝‍🧑 Kamu mengajak ${target} bergabung ke party.`);
      } else {
        msg.reply(`${target} sudah ada di party.`);
      }
    }

    if (body.startsWith('.pvp ')) {
      const opponentId = body.slice(5);
      const opponent = getPlayer(opponentId);
      const myAttack = Math.floor(Math.random() * 30);
      const oppAttack = Math.floor(Math.random() * 30);
      opponent.hp -= myAttack;
      player.hp -= oppAttack;
      msg.reply(`⚔️ PvP dengan ${opponentId}
Kamu menyerang ${myAttack} dmg
Dia menyerang ${oppAttack} dmg`);
    }
  });
}
