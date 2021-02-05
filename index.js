const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const lolis = require('lolis.life')
const loli = new lolis()
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
prefix = '.'
blocked = []

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}
console.log('Starting...')
let { spawn } = require('child_process')
let path = require('path')
const CFonts  = require('cfonts')
CFonts.say('TERMUX WHATSAPP BOT', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']
})
CFonts.say('\'YouTube:\' Drawl Nag', {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
})

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})
	client.on('credentials-updated', () => {
		fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
		info('2', 'Login Info Updated')
	})
	fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected')
	})
	await client.connect({timeoutMs: 30*1000})

	client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Sayonara @${num.split('@')[0]}👋`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@Sage') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = 'Your-Api-Key'
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '[*Wait*] ⏳ Sedang di Prosess ',
				success: '️ Berhasil ✔️',
				error: {
					stick: 'Gagal, terjadi kesalahan saat mengkonversi gambar ke sticker ❌',
					Iv: 'Link tidak valid ❌'
				},
				only: {
					group: ' Perintah ini hanya bisa di gunakan dalam group! ❌',
					ownerG: ' Perintah ini hanya bisa di gunakan oleh owner group! ❌',
					ownerB: ' Perintah ini hanya bisa di gunakan oleh owner bot! ❌',
					admin: ' Perintah ini hanya bisa di gunakan oleh admin group! ❌',
					Badmin: ' Perintah ini hanya bisa di gunakan ketika bot menjadi admin! ❌'
					userB: `──「 DAFTAR 」──\nHalo Kak !\nMaaf Kak Kamu belum Terdaftar Sebagai Teman mirai Daftar Untuk Berteman Dengan Cogan Ardi dengan cara, \n\nCommand : ${prefix}daftar nama|umur\nContoh : ${prefix}daftar Ardi|17\n\n──「 ArdiGans 」──`,
					break
					case 'daftar':
					client.updatePresence(from, Presence.composing)
					if (isUser) return reply('kamu sudah terdaftar')
					if (args.length < 1) return reply(`Parameter Salah\nCommand : ${prefix}daftar nama|umur\nContoh : ${prefix}daftar Ardi|18`)
					var reg = body.slice(8)
					var jeneng = reg.split("|")[0];
					var umure = reg.split("|")[1];
						user.push(sender)
						fs.writeFileSync('./src/user.json', JSON.stringify(user))
						client.sendMessage(from, `\`\`\`Pendaftaran berhasil dengan SN: TM08GK8HEUZBEHDO\`\`\`\n\n\`\`\`Pada ${date} ${time}\`\`\`\n\`\`\`[Nama]: ${jeneng}\`\`\`\n\`\`\`[Nomor]: wa.me/${sender.split("@")[0]}\`\`\`\n\`\`\`[Umur]: ${umure}\`\`\`\n\`\`\`Untuk menggunakan bot\`\`\`\n\`\`\`silahkan\`\`\`\n\`\`\`kirim ${prefix}help\`\`\`\n\`\`\`\nTotal Pengguna ${user.length}\`\`\``, text, {quoted: mek})
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["6285282996146@s.whatsapp.net"]
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'help':
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break
				case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `*Nama bot* : ${me.name}\n*Nomor Bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*The bot is active on* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
                case 'indohot'
                   const axios = require('axios')

const indohot = () => {
    return new Promise((resolve, reject) => {
        var url = `https://arugaz.herokuapp.com/api/indohot`
        axios.get(url)
            .then(res => {
                const { judul, genre, durasi, url } = res.data.result
                resolve({ judul, genre, durasi, url })
             })
    })
}
					break
                case 'pantun'
                   (m, { conn }) => {
  conn.reply(m.chat,`“${pickRandom(global.pantun)}”`, m)
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

global.pantun = [
" *PANTUN:*\n\nAda anak kecil bermain batu,\nBatu dilempar masuk ke sumur,\nBelajar itu tak kenal waktu,\nJuga tidak memandang umur.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nTanam kacang di pagi hari,\nTumbuh enam layu sebatang,\nKeburukan orang jangan dicari,\nBila kalian sedang puasa.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nAkhir bulan mendapat gaji,\nGaji untuk membeli ketupat,\nRajin-rajinlah sholat dan mengaji,\nJanganlah lupa puasa dan zakat.\n *Bye Youtube:* @ArdiGans YT",
" *PANTUN:*\n\nWaktu daftar hari terakhir,\nWaktu terasa banyak terbuang,\nKamu nggak perlu khawatir,\ncintaku hanya untukmu seorang.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nAda anak kecil bermain batu,\nBatu dilempar masuk ke sumur,\nBelajar itu tak kenal waktu,\nJuga tidak memandang umur.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nSeribu bebek di kandang singa,\nhanya satu berwarna belang,\nBeribu cewek di Indonesia,\nhanya engkau yang aku sayang.\n *Bye Youtube:* @ArdiGans YT",
" *PANTUN:*\n\nHari minggu pergi ke pasar,\nBeli sayur dan juga beras,\nTiap hari harus belajar,\nPasti akan menjadi cerdas.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nAyam goreng setengah mateng,\nBelinya di depan tugu.\nAbang sayang, abangku ganteng,\nlneng di sini setia menunggu.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nApi kecil dari tungku,\nApinya kecil habis kayu.\nSudah lama kutunggu-tunggu,\nkapan kamu bilang I love you.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nSeribu bebek di kandang singa,\nhanya satu berwarna belang\nBeribu cewek di Indonesia,\nhanya engkau yang aku sayang.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nPergi memancing saat fajar,\nPulang siang membawa ikan\nSiapa yang rajin belajar\nJadi orang sukses kemudian.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nBeli computer itu biasa\nSupaya belajar jadi semangat\nMari kita belajar puasa\nAgar kita jadi kuat\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nMinum sekoteng hangat rasanya,\nminum segelas ada yang minta.\nLaki-laki ganteng siapa yang punya?\nBolehkah aku jatuh cinta.\n *Bye Youtube:* @ArdiGans YT",
]
                    break
                case 'vont'
                   (m, { conn }) => {
  conn.reply(m.chat,`“${pickRandom(global.vont)}”`, m)
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

global.font = [

"╲╲  ╭━<━━╮╲╲
╲   ┃╭╮╭╮┃╲╲ 
   ┗┫┏━━┓┣┛╲
  ╲ ┃╰━━╯┃  ╲
 ╲  ╰┳━━┳╯╲╲  ╲╲
╲ ╲  ┛╲╲┗",

"╭━ ♥━ ♥━ ♥━ ♥━ ♥
╰╮┏━┳┳┳┓  ┏┳┳┳┳┳┓
┏┻╋━╋┻┻┫  ┣┻┻┻┻┻┫
┗ⓞ━━━ⓞ┻━┻ⓞ━━┻ⓞ━━ⓞ╯",

"╱◥☬◣✺✺﷽✺✺◢☬◤╲
 ❖✿☆❖【𝐈𝐍 𝐒𝐇𝐀】❖e✿❖
◢▩◤◆[🄰🄻🄻🄰🄷]◆◥▩◣
❖✿☆❖(🅢🅤🅡🅖🅐)❖✿☆❖
╲◢☬◤✺✺﷽✺✺◥☬◣╱",

"◢▃▃▃▃◤▔▔▔◥▃▃▃▃◣
  ✺�𝙷𝙰𝙲𝙺 ☬𝐂𝐲𝐛𝐞𝐫𝐓𝐞𝐚𝐦�✺ ◥▔▔▔▔◣▃▃▃◢▔▔▔▔◤",

"▇▇▇◤▔▔▔▔▔▔▔◥▇▇▇ ▇▇▇▏◥▇◣┊◢▇◤▕▇▇▇ ▇▇▇▏▃▆▅▎▅▆▃▇▇▇ ▇▇▇▏╱▔▕▎▔▔╲▕▇▇▇ ▇▇▇◣◣▃▅▎▅▃◢◢▇▇▇ ▇▇▇▇◣◥▅▅▅◤◢▇▇▇▇ ▇▇▇▇▇◣╲▇╱◢▇▇▇▇▇ ▇▇▇▇▇▇◣▇◢▇▇▇▇▇▇",

"╔╗╔╗╔═╗╔╗─╔╗─╔═╗   ║╚╝║║╦╝║║─║║─║║║   ║╔╗║║╩╗║╚╗║╚║║║║   ╚╝╚╝╚═╝╚═╝╚═╝╚═╝"

"..... ╭╬╮◢ 
_╭▅񾆈▇▆▅▄▃▂▁(╳)█╮ ..
   ╰═▃_▁∠════▔▔"▔
   
".        (҂`_´)     <,︻╦̵̵̿╤─ ҉     ~  • █۞███████]▄▄▄▄▄▄▄▄▄▄▃ ●●● ▂▄▅█████████▅▄▃▂… [███████████████████] ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙'",
"*█████████████████████*
*█▄─▄███─▄▄─█▄─█─▄█─▄█*
*██─██▀█─██─██─█─██─▄█*
*▀▄▄▄▄▄▀▄▄▄▄▀▀▄▄▄▀▀▄▄▀*",
]
})
    })
                       
					break
				case 'blocklist':
					teks = 'This is list of blocked number :\n'
					for (let block of blocked) {
						teks += `~> @${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Foto aja mas')
					}
					break
				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								buff = fs.readFileSync(ranw)
								client.sendMessage(from, buff, sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
				    break
                case 'updatemenu'
                   if (!isOwner) return reply(mess.only.ownerB)
                   let { execSync } = require('child_process')
let handler = async (m, { conn, text }) => {
  if (global.conn.user.jid == conn.user.jid) {
    let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''))
    require('fs').readdirSync('lib').map(v=>global.reload('', v))
    conn.reply(m.chat, stdout.toString(), m)
  })
					})
					break
                case 'tessignal'
                   let { performance } = require('perf_hooks')
let handler = async (m, { conn }) => {
  let old = performance.now()
  await m.reply('_Testing speed..._')
  let neww = performance.now()
  m.reply(neww - old + 'ms')
}

})
                    break
                case 'ytmp3'
                   let fetch = require('node-fetch')
let { JSDOM } = require('jsdom')
let limit = 30
let handler = async (m, { conn, args, isPrems, isOwner }) => {
  if (!args || !args[0]) return conn.reply(m.chat, 'Uhm... Link mana?', m)
  let { dl_link, thumb, title, filesize, filesizeF} = await ytv(args[0])
  let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesize
  conn.sendFile(m.chat, thumb, 'thumbnail.jpg', `
*Title:* ${title}
*Filesize:* ${filesizeF}
*${isLimit ? 'Pakai ': ''}Link:* ${dl_link}
`.trim(), m)
  if (!isLimit) conn.sendFile(m.chat, dl_link, title + '.mp3', `
*Title:* ${title}
*Filesize:* ${filesizeF}
`.trim(), m, false, { asDocument: true })
}


function post(url, formdata) {
    console.log(Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&'))
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
            'accept-language': "en-US,en;q=0.9",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&')
    })
}
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
function ytv(url) {
    return new Promise((resolve, reject) => {
        if (ytIdRegex.test(url)) {
            let ytId = ytIdRegex.exec(url)
            url = 'https://youtu.be/' + ytId[1]
            post('https://www.y2mate.com/mates/id4/analyze/ajax', {
                url,
                q_auto: 0,
                ajax: 1
            })
                .then(res => res.json())
                .then(res => {
                    console.log('Scraping...')
                    document = (new JSDOM(res.result)).window.document
                    yaha = document.querySelectorAll('td')
                    filesize = yaha[yaha.length - 10].innerHTML
                    id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
                    thumb = document.querySelector('img').src
                    title = document.querySelector('b').innerHTML

                    post('https://www.y2mate.com/mates/id4/convert', {
                        type: 'youtube',
                        _id: id[1],
                        v_id: ytId[1],
                        ajax: '1',
                        token: '',
                        ftype: 'mp3',
                        fquality: 128
                    })
                        .then(res => res.json())
                        .then(res => {
                            let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
                            resolve({
                                dl_link: /<a.+?href="(.+?)"/.exec(res.result)[1],
                                thumb,
                                title,
                                filesizeF: filesize,
                                filesize: KB
                            })
                        }).catch(reject)
                }).catch(reject)
        } else reject('URL INVALID')
    })
}
					break
				case 'gtts':
					if (args.length < 1) return client.sendMessage(from, 'Kode bahasanya mana om?', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Textnya mana om', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 600
					? reply('Textnya kebanyakan om')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('Gagal om:(')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					}
	
               case "harta"
                  (m, { conn, text }) => {
  conn.hartatahta = conn.hartatahta ? conn.hartatahta : {}
  if (m.chat in conn.hartatahta) throw 'Masih ada yang sedang membuat\nTeks Harta Tahta\ndi chat ini... tunggu sampai selesai'
  else conn.hartatahta[m.chat] = true
  m.reply('_Sedang membuat...⏳_\n*Mohon tunggu Ngab😌*')
  try {
    let img = await ht(text ? text : ':v')
    conn.sendFile(m.chat, img, 'Harta Tahta.png', '*BYArdi*\Nih Ngab🙉', m)
  } finally {
    delete conn.hartatahta[m.chat]
  }

let { spawn } = require('child_process')
let fs = require('fs')
let path = require('path')
let src = path.join(__dirname, '../src/')
let tmp = path.join(__dirname, '../tmp/')
let _font = path.join(src, 'font')
let aesthetic = path.join(src, 'Aesthetic')
function ht(text = '') {
  return new Promise((resolve, reject) => {
    let img = path.join(aesthetic, pickRandom(fs.readdirSync(aesthetic)))
    let font = path.join(_font, 'Roboto-Black.ttf')
    let w = 1024
    let h = w
    let s = w + 'x' + h
    let xF = `(${noise('X', 2, w, 1)}+${noise('Y', 1, h, 1)})/2+128`
    let yF = `((${pickRandom(['', '-'])}${45 * w / 2048}*${pickRandom(['sin', 'cos'])}(X/${w}*4*PI))+${noise('X', 5, w, 0.8)}+${noise('Y', 2, h, 1)})/1.7+128`
    let fsize = 320 / 2048 * w
    let lh = 1.5
    let format = ',format=rgb24'
    let layers = [
      `[v:0]scale=${s}${format}[im]`,
      textArgs('HARTA', 'black', 'white', fsize, font, '(w-text_w)/2', `(h-text_h)/2-(text_h*${lh})`, w, h) + format + '[top]',
      textArgs('TAHTA', 'black', 'white', fsize, font, '(w-text_w)/2', `(h-text_h)/2`, w, h) + format + '[mid]',
      textArgs(text, 'black', 'white', fsize, font, '(w-text_w)/2', `(h-text_h)/2+(text_h*${lh})`, w, h) + format + '[bot]',
      '[top][mid]blend=all_mode=addition[con]',
      '[con][bot]blend=all_mode=addition[txt]',
      `nullsrc=s=${s},geq='r=${xF}:g=${xF}:b=${xF}'[dx]`,
      `nullsrc=s=${s},geq='r=${yF}:g=${yF}:b=${yF}'[dy]`,
      '[txt][dx][dy]displace[wa]',
      '[im][wa]blend=all_mode=multiply:all_opacity=1'
    ]

    let o = 1 * new Date + '_harta_tahta.png'
    o = path.join(tmp, o)
    let args = [
      '-y',
      '-i', img,
      '-filter_complex', layers.join(';'),
      '-frames:v', '1',
      o
    ]
    console.log(layers)
    console.log('ffmpeg', ...args)
    spawn('ffmpeg', args)
    .on('error', reject)
    .on('close', () => {
      try {
        resolve(fs.readFileSync(o))
        fs.unlinkSync(o)
      } catch (e) {
        reject(e)
      }
    })
    //.stderr.on('data', a => console.log(a+''))
  })
}

function noise(_var, depth = 4, s = 1024, freq) {
  let forms = []
  for (let i = 0; i < depth; i++) forms.push(
    formula(
      _var,
      freq * rand(40, 80) * (s / 2048)/ s * ((i + 1) / 5),
      rand(-Math.PI, Math.PI),
      (i + 1) / depth * 8,
      0
    )
  )
  return forms.join('+')
}

function formula(_var, freq, offset, amp, add) {
  return `(${add.toFixed(3)}+${amp.toFixed(4)}*sin(${offset.toFixed(6)}+2*PI*${_var}*${freq.toFixed(6)}))`
}

function textArgs(text, background, color, size, fontfile, x = '200' , y = '200', w = 1024, h = 1024) {
  return `color=${background}:s=${w}x${h},drawtext=text='${text.replace(/[\\]/g, '\\$&')}':fontfile='${fontfile.replace(/[\\]/g, '\\$&')}':x=${x}:y=${y}:fontsize=${size}:fontcolor=${color}`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function rand(min, max, q = 0.001) {
  return Math.floor((Math.random() * (max - min)) / q) * q
}  
					break
                case 'kakulator'
                   global.math = global.math ? global.math : {}
let handler = async (m, { conn, text }) => {
  let id = m.chat
  if (id in global.math) {
    clearTimeout(global.math[id][3])
    delete global.math[id]
    m.reply('Hmmm...ngecheat?')
  }
  let val = text
    .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π|pi/gi, 'Math.PI')
    .replace(/e/gi, 'Math.E')
    .replace(/\/+/g, '/')
    .replace(/\++/g, '+')
    .replace(/-+/g, '-')
  let format = val
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\//g, '÷')
    .replace(/\*×/g, '×')
  try {
    console.log(val)
    let result = (new Function('return ' + val))()
    if (!result) throw result
    m.reply(`*${format}* = _${result}_`)
  } catch (e) {
    if (e == undefined) throw 'Isinya?'
    throw 'Format salah, hanya 0-9 dan Simbol -, +, *, /, ×, ÷, π, e, (, ) yang disupport'
  }
}
					break
                case 'base64'
                   (m, { command, text }) => {
  let txt = m.quoted ? m.quoted.text ? m.quoted.text : text ? text : m.text : m.text
  m.reply(Buffer.from(txt, 'utf-8').toString('base64'))
}
					break
				case 'meme':
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
                case 'attp'
                   const fetch = require('node-fetch')
const FormData = require('form-data')
const { MessageType } = require('@adiwajshing/baileys')

let handler  = async (m, { conn, text }) => {
  if (text) conn.sendFile(m.chat, global.API('xteam', '/attp', { file: '', text }), 'attp.webp', '', m, false, { asSticker: true })
  else throw 'Uhm...Teksnya?'
}
					break
                case 'broadcast'
                   if (!isOwner) return reply(mess.only.ownerB)
                    async (m, { conn, text }) => {
                    let chats = conn.chats.array.filter(v => !v.read_only && v.message).map(v => v.jid)
                    for (let id of chats) conn.sendMessage(id, text + (/broadcast/im.test(text) ? '' : ('\n'+'[ *BROADCAST* ]')), m.mtype, m.msg.contextInfo ? {
                    contextInfo: m.msg.contextInfo
                    } : {})
                    conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat_`, m)
                    })
                    break
                case 'profile'
                   (m, { conn }) => {
  let pp = './src/avatar_contact.png'
  try {
    pp = await conn.getProfilePicture(m.sender)
  } catch (e) {

  } finally {
    let name = m.fromMe ? conn.user : conn.contacts[m.sender]
    let str = `
Name: ${name.vnmae || name.notify || name.name || ('+' + name.jid.split`@`[0])} (@${m.sender.replace(/@.+/, '')})
Number: +${m.sender.split`@`[0]}
Link: https://wa.me/${m.sender.split`@`[0]}
`.trim()
    let mentionedJid = [m.sender]
    conn.sendFile(m.chat, pp, 'pp.jpg', str, m, false, { contextInfo: { mentionedJid }})
  }
}

					break
				case 'memeindo':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
               case 'ttp'
                  const fetch = require('node-fetch')
const FormData = require('form-data')
const { MessageType } = require('@adiwajshing/baileys')

let handler  = async (m, { conn, text }) => {
  if (text) {
    let res = await fetch('https://api.areltiyan.site/sticker_maker?text=' + encodeURIComponent(text))
    let json = await res.json()
    let img = Buffer.from(json.base64.split`,`[1], 'base64')
    if (!img) throw img
    let stiker = await sticker(img)
    conn.sendMessage(m.chat, stiker, MessageType.sticker, {
      quoted: m
    })
  }


async function canvas(code, type = 'png', quality = 0.92) {
    let res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + queryURL({
        type,
        quality
    }), {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': code.length
        },
        body: code
    })
    let image = await res.buffer()
    return image
}

function queryURL(queries) {
    return Object.entries(queries).map(([key, value]) => key + (value ? '=' + encodeURIComponent(value) : '')).join('&')
}

let { fromBuffer } = require('file-type')
async function sticker(img, url) {
    url = url ? url : await uploadImage(img)
    let {
        mime
    } = url ? {mime:'image/jpeg'} : await fromBuffer(img)
    let sc = `let im = await loadImg('data:${mime};base64,'+(await window.loadToDataURI('${url}')))
c.width = c.height = 512
let max = Math.max(im.width, im.height)
let w = 512 * im.width / max
let h = 512 * im.height / max
ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
`
    return await canvas(sc, 'webp')
}

function uploadImage(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                ext
            } = await fromBuffer(buffer)
            let form = new FormData()
            form.append('file', buffer, 'tmp.' + ext)
            let res = await fetch('https://telegra.ph/upload', {
                method: 'POST',
                body: form
            })
            let img = await res.json()
            if (img.error) reject(img.error)
            else resolve('https://telegra.ph' + img[0].src)
        } catch (e) {
            reject(e)
        }
    })
}

					break
               case 'getcodebot'
                  (m, { conn, usedPrefix }) => {
                  if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, 'Command ini hanya untuk yang jadi bot', m)
                  else global.conn.reply(conn.user.jid, `${usedPrefix}jadibot ${Buffer.from(JSON.stringify(conn.base64EncodedAuthInfo())).toString('base64')}`, m)
                  }
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
					break
				case 'loli':
					loli.getSFWLoli(async (err, res) => {
						if (err) return reply('❌ *ERROR* ❌')
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Ingat! Citai Lolimu'})
					})
					break
				case 'nsfwloli':
					if (!isNsfw) return reply('❌ *FALSE* ❌')
					loli.getNSFWLoli(async (err, res) => {
						if (err) return reply('❌ *ERROR* ❌')
						buffer = await getBuffer(res.url)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
					})
					break
				case 'hilih':
					if (args.length < 1) return reply('Teksnya mana um?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
                case 'bucin'
                   (m, { conn }) => {
conn.reply(m.chat,`“${pickRandom(global.bucin)}”`, m)
   })
})
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

// https://jalantikus.com/tips/kata-kata-bucin/
global.bucin = [
  "Aku memilih untuk sendiri, bukan karena menunggu yang sempurna, tetapi butuh yang tak pernah menyerah.",
  "Seorang yang single diciptakan bersama pasangan yang belum ditemukannya.",
  "Jomblo. Mungkin itu cara Tuhan untuk mengatakan 'Istirahatlah dari cinta yang salah'.",
  "Jomblo adalah anak muda yang mendahulukan pengembangan pribadinya untuk cinta yang lebih berkelas nantinya.",
  "Aku bukan mencari seseorang yang sempurna, tapi aku mencari orang yang menjadi sempurna berkat kelebihanku.",
  "Pacar orang adalah jodoh kita yang tertunda.",
  "Jomblo pasti berlalu. Semua ada saatnya, saat semua kesendirian menjadi sebuah kebersamaan dengannya kekasih halal. Bersabarlah.",
  "Romeo rela mati untuk juliet, Jack mati karena menyelamatkan Rose. Intinya, kalau tetap mau hidup, jadilah single.",
  "Aku mencari orang bukan dari kelebihannya tapi aku mencari orang dari ketulusan hatinya.",
  "Jodoh bukan sendal jepit, yang kerap tertukar. Jadi teruslah berada dalam perjuangan yang semestinya.",
  "Kalau kamu jadi senar gitar, aku nggak mau jadi gitarisnya. Karena aku nggak mau mutusin kamu.",
  "Bila mencintaimu adalah ilusi, maka izinkan aku berimajinasi selamanya.",
  "Sayang... Tugas aku hanya mencintaimu, bukan melawan takdir.",
  "Saat aku sedang bersamamu rasanya 1 jam hanya 1 detik, tetapi jika aku jauh darimu rasanya 1 hari menjadi 1 tahun.",
  "Kolak pisang tahu sumedang, walau jarak membentang cintaku takkan pernah hilang.",
  "Aku ingin menjadi satu-satunya, bukan salah satunya.",
  "Aku tidak bisa berjanji untuk menjadi yang baik. Tapi aku berjanji akan selalu mendampingi kamu.",
  "Kalau aku jadi wakil rakyat aku pasti gagal, gimana mau mikirin rakyat kalau yang selalu ada dipikiran aku hanyalah dirimu.",
  "Lihat kebunku, penuh dengan bunga. Lihat matamu, hatiku berbunga-bunga.",
  "Berjanjilah untuk terus bersamaku sekarang, esok, dan selamanya.",
  "Rindu tidak hanya muncul karena jarak yang terpisah. Tapi juga karena keinginan yang tidak terwujud.",
  "Kamu tidak akan pernah jauh dariku, kemanapun aku pergi kamu selalu ada, karena kamu selalu di hatiku, yang jauh hanya raga kita bukan hati kita.",
  "Aku tahu dalam setiap tatapanku, kita terhalang oleh jarak dan waktu. Tapi aku yakin kalau nanti kita pasti bisa bersatu.",
  "Merindukanmu tanpa pernah bertemu sama halnya dengan menciptakan lagu yang tak pernah ternyayikan.",
  "Ada kalanya jarak selalu menjadi penghalang antara aku sama kamu, namun tetap saja di hatiku kita selalu dekat.",
  "Jika hati ini tak mampu membendung segala kerinduan, apa daya tak ada yang bisa aku lakukan selain mendoakanmu.",
  "Mungkin di saat ini aku hanya bisa menahan kerinduan ini. Sampai tiba saatnya nanti aku bisa bertemu dan melepaskan kerinduan ini bersamamu.",
  "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu.",
  "Dalam dinginnya malam, tak kuingat lagi; Berapa sering aku memikirkanmu juga merindukanmu.",
  "Merindukanmu itu seperti hujan yang datang tiba-tiba dan bertahan lama. Dan bahkan setelah hujan reda, rinduku masih terasa.",
  "Sejak mengenalmu bawaannya aku pengen belajar terus, belajar menjadi yang terbaik buat kamu.",
  "Tahu gak perbedaan pensi sama wajah kamu? Kalau pensil tulisannya bisa dihapus, tapi kalau wajah kamu gak akan ada yang bisa hapus dari pikiran aku.",
  "Bukan Ujian Nasional besok yang harus aku khawatirkan, tapi ujian hidup yang aku lalui setelah kamu meninggalkanku.",
  "Satu hal kebahagiaan di sekolah yang terus membuatku semangat adalah bisa melihat senyumanmu setiap hari.",
  "Kamu tahu gak perbedaanya kalau ke sekolah sama ke rumah kamu? Kalo ke sekolah pasti yang di bawa itu buku dan pulpen, tapi kalo ke rumah kamu, aku cukup membawa hati dan cinta.",
  "Aku gak sedih kok kalo besok hari senin, aku sedihnya kalau gak ketemu kamu.",
  "Momen cintaku tegak lurus dengan momen cintamu. Menjadikan cinta kita sebagai titik ekuilibrium yang sempurna.",
  "Aku rela ikut lomba lari keliling dunia, asalkan engkai yang menjadi garis finishnya.",
  "PR-ku adalah merindukanmu. Lebih kuat dari Matematika, lebih luas dari Fisika, lebih kerasa dari Biologi.",
  "Cintaku kepadamu itu bagaikan metabolisme, yang gak akan berhenti sampai mati.",
  "Kalau jelangkungnya kaya kamu, dateng aku jemput, pulang aku anter deh.",
  "Makan apapun aku suka asal sama kamu, termasuk makan ati.",
  "Cinta itu kaya hukuman mati. Kalau nggak ditembak, ya digantung.",
  "Mencintaimu itu kayak narkoba: sekali coba jadi candu, gak dicoba bikin penasaran, ditinggalin bikin sakaw.",
  "Gue paling suka ngemil karena ngemil itu enak. Apalagi ngemilikin kamu sepenuhnya...",
  "Dunia ini cuma milik kita berdua. Yang lainnya cuma ngontrak.",
  "Bagi aku, semua hari itu adalah hari Selasa. Selasa di Surga bila dekat denganmu...",
  "Bagaimana kalau kita berdua jadi komplotan penjahat? Aku curi hatimu dan kamu curi hatiku.",
  "Kamu itu seperti kopi yang aku seruput pagi ini. Pahit, tapi bikin nagih.",
  "Aku sering cemburu sama lipstikmu. Dia bisa nyium kamu tiap hari, dari pagi sampai malam.",
  "Hanya mendengar namamu saja sudah bisa membuatku tersenyum seperti orang bodoh.",
  "Aku tau teman wanitamu bukan hanya satu, dan menyukaimu pun bukan hanya aku.",
  "Semenjak aku berhenti berharap pada dirimu, aku jadi tidak semangat dalam segala hal..",
  "Denganmu, jatuh cinta adalah patah hati paling sengaja.",
  "Sangat sulit merasakan kebahagiaan hidup tanpa kehadiran kamu disisiku.",
  "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu.",
  "Sendainya kamu tahu, sampai saat ini aku masih mencintaimu.",
  "Terkadang aku iri sama layangan..talinya putus saja masih dikejar kejar dan gak rela direbut orang lain...",
  "Aku tidak tahu apa itu cinta, sampai akhirnya aku bertemu denganmu. Tapi, saat itu juga aku tahu rasanya patah hati.",
  "Mengejar itu capek, tapi lebih capek lagi menunggu\nMenunggu kamu menyadari keberadaanku...",
  "Jangan berhenti mencinta hanya karena pernah terluka. Karena tak ada pelangi tanpa hujan, tak ada cinta sejati tanpa tangisan.",
  "Aku punya sejuta alasan unutk melupakanmu, tapi tak ada yang bisa memaksaku untuk berhenti mencintaimu.",
  "Terkadang seseorang terasa sangat bodoh hanya untuk mencintai seseorang.",
  "Kamu adalah patah hati terbaik yang gak pernah aku sesali.",
  "Bukannya tak pantas ditunggu, hanya saja sering memberi harapan palsu.",
  "Sebagian diriku merasa sakit, Mengingat dirinya yang sangat dekat, tapi tak tersentuh.",
  "Hal yang terbaik dalam mencintai seseorang adalah dengan diam-diam mendo akannya.",
  "Kuharap aku bisa menghilangkan perasaan ini secepat aku kehilanganmu.",
  "Demi cinta kita menipu diri sendiri. Berusaha kuat nyatanya jatuh secara tak terhormat.",
  "Anggaplah aku rumahmu, jika kamu pergi kamu mengerti kemana arah pulang. Menetaplah bila kamu mau dan pergilah jika kamu bosan...",
  "Aku bingung, apakah aku harus kecewa atu tidak? Jika aku kecewa, emang siapa diriku baginya?\n\nKalau aku tidak kecewa, tapi aku menunggu ucapannya.",
  "Rinduku seperti ranting yang tetap berdiri.Meski tak satupun lagi dedaunan yang menemani, sampai akhirnya mengering, patah, dan mati.",
  "Kurasa kita sekarang hanya dua orang asing yang memiliki kenangan yang sama.",
  "Buatlah aku bisa membencimu walau hanya beberapa menit, agar tidak terlalu berat untuk melupakanmu.",
  "Aku mencintaimu dengan segenap hatiku, tapi kau malah membagi perasaanmu dengan orang lain.",
  "Mencintaimu mungkin menghancurkanku, tapi entah bagaimana meninggalkanmu tidak memperbaikiku.",
  "Kamu adalah yang utama dan pertama dalam hidupku. Tapi, aku adalah yang kedua bagimu.",
  "Jika kita hanya bisa dipertemukan dalam mimpi, aku ingin tidur selamanya.",
  "Melihatmu bahagia adalah kebahagiaanku, walaupun bahagiamu tanpa bersamaku.",
  "Aku terkadang iri dengan sebuah benda. Tidak memiliki rasa namun selalu dibutuhkan. Berbeda dengan aku yang memiliki rasa, namun ditinggalkan dan diabaikan...",
  "Bagaimana mungkin aku berpindah jika hanya padamu hatiku bersinggah?",
  "Kenangan tentangmu sudah seperti rumah bagiku. Sehingga setiap kali pikiranku melayang, pasti ujung-ujungnya akan selalu kembali kepadamu.",
  "Kenapa tisue bermanfaat? Karena cinta tak pernah kemarau. - Sujiwo Tejo",
  "Kalau mencintaimu adalah kesalahan, yasudah, biar aku salah terus saja.",
  "Sejak kenal kamu, aku jadi pengen belajar terus deh. Belajar jadi yang terbaik buat kamu.",
  "Ada yang bertingkah bodoh hanya untuk melihatmu tersenyum. Dan dia merasa bahagia akan hal itu.",
  "Aku bukan orang baik, tapi akan belajar jadi yang terbaik untuk kamu.",
  "Kita tidak mati, tapi lukanya yang membuat kita tidak bisa berjalan seperti dulu lagi.",
  "keberadaanmu bagaikan secangkir kopi yang aku butuhkan setiap pagi, yang dapat mendorongku untuk tetap bersemangat menjalani hari.",
  "Aku mau banget ngasih dunia ke kamu. Tapi karena itu nggak mungkin, maka aku akan kasih hal yang paling penting dalam hidupku, yaitu duniaku.",
  "Mending sing humoris tapi manis, ketimbang sok romantis tapi akhire tragis.",
  "Ben akhire ora kecewa, dewe kudu ngerti kapan waktune berharap lan kapan kudu mandeg.",
  "Aku ki wong Jowo seng ora ngerti artine 'I Love U'. Tapi aku ngertine mek 'Aku tresno awakmu'.",
  "Ora perlu ayu lan sugihmu, aku cukup mok setiani wes seneng ra karuan.",
  "Cintaku nang awakmu iku koyok kamera, fokus nang awakmu tok liyane mah ngeblur.",
  "Saben dino kegowo ngimpi tapi ora biso nduweni.",
  "Ora ketemu koe 30 dino rasane koyo sewulan.",
  "Aku tanpamu bagaikan sego kucing ilang karete. Ambyar.",
  "Pengenku, Aku iso muter wektu. Supoyo aku iso nemokne kowe lewih gasik. Ben Lewih dowo wektuku kanggo urip bareng sliramu.",
  "Aku ora pernah ngerti opo kui tresno, kajaba sak bare ketemu karo sliramu.",
  "Cinta aa ka neng moal leungit-leungit sanajan aa geus kawin deui.",
  "Kasabaran kaula aya batasna, tapi cinta kaula ka anjeun henteu aya se epna.",
  "Kanyaah akang moal luntur najan make Bayclean.",
  "Kenangan endah keur babarengan jeung anjeun ek tuluy diinget-inget nepi ka poho.",
  "Kuring moal bakal tiasa hirup sorangan, butuh bantosan jalmi sejen.",
  "Nyaahna aa ka neg teh jiga tukang bank keur nagih hutang (hayoh mumuntil).",
  "Kasabaran urang aya batasna, tapi cinta urang ka maneh moal aya beakna.",
  "Hayang rasana kuring ngarangkai kabeh kata cinta anu aya di dunya ieu, terus bade ku kuring kumpulkeun, supaya anjeun nyaho gede pisan rasa cinta kuring ka anjeun.",
  "Tenang wae neng, ari cinta Akang mah sapertos tembang krispatih; Tak lekang oleh waktu.",
  "Abdi sanes jalmi nu sampurna pikeun anjeun, sareng sanes oge nu paling alus kanggo anjeun. Tapi nu pasti, abdi jalmi hiji-hijina nu terus emut ka anjeun.",
  "Cukup jaringan aja yang hilang, kamu jangan.",
  "Sering sih dibikin makan ati. Tapi menyadari kamu masih di sini bikin bahagia lagi.",
  "Musuhku adalah mereka yang ingin memilikimu juga.",
  "Banyak yang selalu ada, tapi kalo cuma kamu yang aku mau, gimana?",
  "Jam tidurku hancur dirusak rindu.",
  "Cukup China aja yang jauh, cinta kita jangan.",
  "Yang penting itu kebahagiaan kamu, aku sih gak penting..",
  "Cuma satu keinginanku, dicintai olehmu..",
  "Aku tanpamu bagaikan ambulans tanpa wiuw wiuw wiuw.",
  "Cukup antartika aja yang jauh. Antarkita jangan."
]
					break
                case 'jadibot'
                   let { WAConnection: _WAConnection, MessageType } = require('@adiwajshing/baileys')
let WAConnection = require('../lib/simple').WAConnection(_WAConnection)
let qrcode = require('qrcode')

if (global.conns instanceof Array) console.log()// for (let i of global.conns) global.conns[i] && global.conns[i].user ? global.conns[i].close().then(() => delete global.conns[id] && global.conns.splice(i, 1)).catch(global.conn.logger.error) : delete global.conns[i] && global.conns.splice(i, 1)
else global.conns = []

let handler  = async (m, { conn, args, usedPrefix, command }) => {
  let parent = args[0] && args[0] == 'plz' ? conn : global.conn
  let auth = false
  if ((args[0] && args[0] == 'plz') || global.conn.user.jid == conn.user.jid) {
    let id = global.conns.length
    let conn = new WAConnection()
    if (args[0] && args[0].length > 200) {
      let json = Buffer.from(args[0], 'base64').toString('utf-8')
      // global.conn.reply(m.isGroup ? m.sender : m.chat, json, m)
      let obj = JSON.parse(json)
      await conn.loadAuthInfo(obj)
      auth = true
    }
    conn.on('qr', async qr => {
      let scan = await parent.sendFile(m.chat, await qrcode.toDataURL(qr, { scale: 8 }), 'qrcode.png', 'Scan QR ini untuk jadi bot sementara\n\n1. Klik titik tiga di pojok kanan atas\n2. Ketuk WhatsApp Web\n3. Scan QR ini \nQR Expired dalam 20 detik', m)
      setTimeout(() => {
        parent.deleteMessage(m.chat, scan.key)
      }, 30000)
    })
    conn.once('connection-validated', user => {
      parent.reply(m.chat, 'Berhasil tersambung dengan WhatsApp - mu.\n*NOTE: Ini cuma numpang*\n' + JSON.stringify(user, null, 2), m)
    })
    conn.welcome = global.conn.welcome
    conn.bye = global.conn.bye
    conn.on('group-add', global.conn.onAdd)
    conn.on('group-leave', global.conn.onLeave)
    conn.on('message-new', global.conn.handler)
    conn.regenerateQRIntervalMs = null
    conn.connect().then(async ({user}) => {
      if (auth) return
      await parent.sendMessage(user.jid, `Kamu bisa login tanpa qr dengan pesan dibawah ini. untuk mendapatkan kode lengkapnya, silahkan kirim *${usedPrefix}getcode* untuk mendapatkan kode yang akurat`, MessageType.extendedText)
      parent.sendMessage(user.jid, `${usedPrefix + command} ${Buffer.from(JSON.stringify(conn.base64EncodedAuthInfo())).toString('base64')}`, MessageType.extendedText)
    })
    setTimeout(() => {
      if (conn.user) return
      conn.close()
      delete global.conns[id]
    }, 60000)
    conn.on('close', conn.logger.info)
    global.conns.push(conn)
  } else throw 'Tidak bisa membuat bot didalam bot!\n\nhttps://wa.me/' + global.conn.user.jid.split`@`[0] + '?text=.jadibot'
}
					break
				case 'yt2mp3':
					if (args.length < 1) return reply('Urlnya mana um?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/yta?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case 'ytsearch':
					if (args.length < 1) return reply('Yang mau di cari apaan? titit?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
				case 'tiktok':
					if (args.length < 1) return reply('Urlnya mana um?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, 'Usernamenya mana um?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('Kemungkinan username tidak valid')
					}
					break
				case 'nulis':
				case 'tulis':
					if (args.length < 1) return reply('Yang mau di tulis apaan?')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
				case 'url2img':
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('Tipenya apa um?')
					if (!tipelist.includes(args[0])) return reply('Tipe desktop|tablet|mobile')
					if (args.length < 2) return reply('Urlnya mana um?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'tstiker':
				case 'tsticker':
					if (args.length < 1) return reply('Textnya mana um?')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						client.sendMessage(from, buffer, sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
				case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*#* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
				case 'clearall':
					if (!isOwner) return reply('Kamu siapa?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Sukses delete all chat :)')
					break
				case 'bc':
					if (!isOwner) return reply('Kamu siapa?')
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `[ Ini Broadcast ]\n\n${body.slice(4)}`})
						}
						reply('Suksess broadcast')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `[ Ini Broadcast ]\n\n${body.slice(4)}`)
						}
						reply('Suksess broadcast')
					}
					break
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Yang mau di add jin ya?')
					if (args[0].startsWith('08')) return reply('Gunakan kode negara mas')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Gagal menambahkan target, mungkin karena di private')
					}
					break
				case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Perintah di terima, mengeluarkan :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmins':
					if (!isGroup) return reply(mess.only.group)
					teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'toimg':
					if (!isQuotedSticker) return reply('❌ reply stickernya um ❌')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Gagal, pada saat mengkonversi sticker ke gambar ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
				case 'simi':
					if (args.length < 1) return reply('Textnya mana um?')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('Simi ga tau kak')
					reply(anu)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('Mode simi sudah aktif')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukses mengaktifkan mode simi di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukes menonaktifkan mode simi di group ini ✔️')
					} else {
						reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('Udah aktif um')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses mengaktifkan fitur welcome di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses menonaktifkan fitur welcome di group ini ✔️')
					} else {
						reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
					}
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Tag target yang ingin di clone')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('Gagal om')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('Foto aja mas')
					}
					break
				default:
					if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
