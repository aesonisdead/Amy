import util from 'util'
import path from 'path'

let user = a => '@' + a.split('@')[0]
let toM = a => '@' + a.split('@')[0]
let pickRandom = list => list[Math.floor(Math.random() * list.length)]
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const handler = async (m, { groupMetadata, command, conn, text, usedPrefix, args }) => {
if (!global.db.data.chats[m.chat].gacha && m.isGroup) return m.reply(`꒰🎀꒱ *Gacha* commands are disabled in this group.\n\nUn *administrator* can activate them with the command:\n» *${usedPrefix}gacha on*`)
try {
let ps = groupMetadata.participants.map(v => v.id)
if (command == 'top') {
let cantidad = 10
let texto = text
if (!isNaN(parseInt(args[0]))) {
cantidad = Math.min(Math.max(parseInt(args[0]), 1), 10)
texto = args.slice(1).join(' ')
}
if (!texto) return conn.reply(m.chat, `🎀 Please enter a text after the number to make a Top *amount text*`, m)
if (ps.length < cantidad) return conn.reply(m.chat, `🎀 There are not enough members to make a Top ${cantidad}`, m)
let seleccionados = []
while (seleccionados.length < cantidad) {
let candidato = ps[Math.floor(Math.random() * ps.length)]
if (!seleccionados.includes(candidato)) seleccionados.push(candidato)
}
let x = pickRandom(['🤓','😅','😂','😳','😎','🥵','😱','🤑','🙄','🎀','🍑','🤨','💗','🔥','🍓','😔','👀','🌚','😰'])
let top = `*${x} Top ${cantidad} ${texto} ${x}*\n\n`
seleccionados.forEach((u, i) => {
top += `${i + 1}. ${user(u)}\n`
})
return m.reply(top.trim(), null, { mentions: seleccionados })
}
if (command == 'lottery') {
if (!text) return conn.reply(m.chat, `🎀 Please enter what you want to raffle.`, m)
let cantidad = 1
let premio = text
if (!isNaN(parseInt(args[0]))) {
cantidad = Math.min(Math.max(parseInt(args[0]), 1), 10)
premio = args.slice(1).join(' ')
}
if (!premio) return conn.reply(m.chat, `🎀 Please enter a text after the number to make the draw.`, m)
if (ps.length < cantidad) return conn.reply(m.chat, `🎀 Not enough members to select ${cantidad} winner(s).`, m)
let seleccionados = []
while (seleccionados.length < cantidad) {
let candidato = ps[Math.floor(Math.random() * ps.length)]
if (!seleccionados.includes(candidato)) seleccionados.push(candidato)
}
let mensaje = cantidad === 1 ? `✦ CONGRATULATIONS ✦\n\n🎀 ${user(seleccionados[0])}\n○ You have won a *${premio}*` : `✦ CONGRATULATIONS ✦\n\n` + seleccionados.map((u, i) => `${i + 1}. ${user(u)}`).join('\n') + `\n\n○ They have won a *${premio}*`
return await conn.sendMessage(m.chat, { text: mensaje.trim(), mentions: seleccionados }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 })
}
if (command == 'ship' || command == 'shippear') {
if (!text) return conn.reply(m.chat, `🎀 Write your name and the other person's name to calculate their love.`, m)
let [text1, ...text2] = text.split(' ')
text2 = (text2 || []).join(' ')
if (!text2) return conn.reply(m.chat, `🎀 Write the name of the second person.`, m)
let love = `❤️ *${text1}* your chance to fall in love with *${text2}* is about ${Math.floor(Math.random() * 100)}% 👩🏻‍❤️‍👨🏻`
return m.reply(love, null, { mentions: conn.parseMention(love) })
}
if (command == 'afk') {
const user = global.db.data.users[m.sender]
user.afk = Date.now()
user.afkReason = text
return await conn.reply(m.chat, `🎀 *The User ${await conn.getName(m.sender)} is now AFK*\n○ *Reason${text ? ': ' + text : ': Unspecified!'}*`, m)
}
if (command == 'personality') {
let mentionedJid = await m.mentionedJid
let userId = mentionedJid?.[0] || (m.quoted && await m.quoted.sender) || conn.parseMention(text)?.[0] || text || null
let nombre = !userId?.includes('@s.whatsapp.net') ? userId : global.db.data.users[userId].name || (await conn.getName(userId).catch(() => userId.split('@')[0])) || userId.split('@')[0]
let userName = userId?.includes('@s.whatsapp.net') ? `*${nombre}*` : `*${userId}*`
if (!userId) return conn.reply(m.chat, `🎀 Please enter someone's name.`, m)
let personalidad = `> • Name » ${userName}\n> • Good Morals » ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}\n> • Bad Morals : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}\n> • Type of person » ${pickRandom('Kind-hearted','Arrogant','Mean','Generous','Humble','Shy','Coward','Nosy','Crystal','Non-binary XD', 'Dumbass'])}\n> • Always » ${pickRandom(['Heavy, Bad, Distracted, Annoying, Gossiping, He goes jerking it off','Shopping, Watching anime,'Chat on WhatsApp because they are single','Lying good for nothing',''A womanizer', 'On the cell phone'])}\n> • Intelligence » ${pickRandom(['9%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}\n> • Idiot » ${pickRandom(['9%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}\n> • Delinquency » ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}\n> • Courage » ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}\n> • Fear » ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}\n> • Fame » ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}\n> • Gender » ${pickRandom(['Man', 'Women', 'Homosexual', 'Bisexual', 'Pansexual'', 'Feminist', 'Heterosexual', 'Alpha male', 'Big woman', 'Tomboy', 'Palosexual', 'PlayStationSexual', 'Mr. Manuela', 'Pollosexual'])}`
return await conn.reply(m.chat, personalidad, m)
}
if (command == 'formacouple') {
let R = Math.random
let Fl = Math.floor
const frases = ["This couple is destined to be together 💙", "Two little lovebirds in love ✨", "They should even have a family. 🤱🧑‍🍼", "They got married in secret 💍", "They are on their honeymoon ✨🥵😍❤️", "They are inseparable like coffee and arepa ☕🥙", "Their chemistry is from another planet 🌌", "Explosive couple that ignites the group 🔥", "Love that not even time can erase ⏳❤️", "They look at each other and the world disappears 🌍💫", "Romance worthy of a novel 📖💘", "A couple that everyone envies 😍👀", "They are the soul of the group together 🎉💑", "Love that was born in stickers 💬💞", "A couple that even shares mobile data 📱❤️", "Your connection is stronger than WiFi 📶💘", "Couple that understands each other with just emojis 😘😎", "Love that not even the bot can ignore 🤖💓", "Couple that deserves their own command 🧾💑", "They are so sweet that they raise your sugar 🍭💕"]
let cantidad = Math.min(Math.max(parseInt(args[0]) || 1, 1), 10)
let ps = groupMetadata.participants.map(v => v.id)
if (ps.length < cantidad * 2) return m.reply(`🎀 There are not enough members to form ${cantidad} couple${cantidad === 1 ? '' : 's'}`)
let usados = new Set()
let parejas = []
let menciones = []
for (let i = 0; i < cantidad; i++) {
let a, b
do a = ps[Fl(R() * ps.length)]
while (usados.has(a))
usados.add(a)
do b = ps[Fl(R() * ps.length)]
while (b === a || usados.has(b))
usados.add(b)
parejas.push({a, b})
menciones.push(a, b)
}
let texto = cantidad === 1 ? `*😍 _The best couple in the group_ 😍*\n\n` : `*😍 _The ${cantidad} best couples in the group_ 😍*\n\n`
parejas.forEach((p, i) => {
texto += `${i + 1}.- ${toM(p.a)} y ${toM(p.b)}\n${frases[i % frases.length]}\n\n`
})
return m.reply(texto.trim(), null, { mentions: menciones })
}
if (['gay','lesbian','wanker','asshole','hoe','bitch','one-armed','sucker','rat','prostitute','prefessional dih sucker'].includes(command)) {
const mentionedJid = await m.mentionedJid
const usser = mentionedJid?.[0] || (m.quoted && await m.quoted.sender) || conn.parseMention(text)?.[0] || text || null
const userId = usser?.includes('@s.whatsapp.net') ? `@${usser.split('@')[0]}` : `*${usser}*`
if (!usser) return conn.reply(m.chat, `ꕥ Please mention a user to check their test..`, m)
const percentages = (500).getRandom()
let emoji = ''
let description = ''
switch (command) {
case 'gay':
emoji = '🏳️‍🌈'
description = percentages < 50 ? `💙 Calculations have shown that ${userId} is *${percentages}%* Gay ${emoji}\n> ✰ That is low, but you are still gay!` : percentages > 100 ? `💜 Calculations have shown that ${userId} is *${percentages}%* Gay ${emoji}\n> ✰ ¡Even gayer than we thought!` : `🖤 Calculations have shown that ${userId} is *${percentages}%* Gay ${emoji}\n> ✰ Your thing, your thing is that you are Gay.`
break
case 'lesbian':
emoji = '🏳️‍⚧️'
description = percentages < 50 ? `👻 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n✰ Maybe you need more romantic movies in your life..` : percentages > 100 ? `❣️ Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ That is some extreme love for Girls!` : `💗 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ Keep love blooming!`
break
case 'wanker': case 'asshole':
emoji = '😏💦'
description = percentages < 50 ? `🧡 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ Maybe you need more hobbies!` : percentages > 100 ? `💕 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ That is admirable resilience!` : `💞 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ Keep up the good (solo) work.`
break
case 'bitch': case 'hoe':
emoji = '🔥🥵'
description = percentages < 50 ? `😼 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✧ Better luck on your next conquest!` : percentages > 100 ? `😻 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ You are on fire!` : `😺 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ Keep that charm burning!`
break
case 'sucking': case 'sucker':
emoji = '💩'
description = percentages < 50 ? `🌟 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ You are not the only one in that club!` : percentages > 100 ? `💌 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ ¡You have a very special talent!` : `🥷 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ Keep that brave attitude!`
break
case 'rat':
emoji = '🐁'
description = percentages < 50 ? `💥 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ Nothing wrong with enjoying cheese!` : percentages > 100 ? `💖 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ A real luxury mouse!` : `👑 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ Eat cheese responsibly!`
break
case 'prostitute': case 'prostitute':
emoji = '🫦👅'
description = percentages < 50 ? `ꕥ Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ The market is booming!` : percentages > 100 ? `💖 Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ A true professional!` : `✨️ Calculations have shown that ${userId} is *${percentages}%* ${command} ${emoji}\n> ✰ Its always time for business!`
break
}
const responses = ["The universe has spoken.", "Scientists confirm it.", "¡Surprise!", "It was known 🤣"]
const response = responses[Math.floor(Math.random() * responses.length)]
const cal = `ꕥ *CALCULATOR*\n\n${description}\n\n➤ ${response}`.trim()
const hawemod = ["《 █▒▒▒▒▒▒▒▒▒▒▒》10%", "《 ████▒▒▒▒▒▒▒▒》30%", "《 ███████▒▒▒▒▒》50%", "《 ██████████▒▒》80%", "《 ████████████》100%"]
let { key } = await conn.sendMessage(m.chat, { text: `🎀 ¡Calculating Percentage!`, mentions: conn.parseMention(cal) }, { quoted: fkontak })
for (let i = 0; i < hawemod.length; i++) {
await new Promise(resolve => setTimeout(resolve, 1000))
await conn.sendMessage(m.chat, { text: hawemod[i], edit: key, mentions: conn.parseMention(cal) }, { quoted: fkontak })
}
return await conn.sendMessage(m.chat, { text: cal, edit: key, mentions: conn.parseMention(cal) }, { quoted: fkontak })
}
if (['doxing, doxxing, doxing'].includes(command)) {
let mentionedJid = await m.mentionedJid
let userId = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
let userName = await (async () => global.db.data.users[userId].name || (async () => { try { const n = await conn.getName(userId); return typeof n === 'string' && n.trim() ? n : userId.split('@')[0] } catch { return userId.split('@')[0] } })())()
if (!userId) return conn.reply(m.chat, `🎀 Please enter a user's tag or reply to a message..`, m)
let start = `ꕥ *Starting doxing*...`
let boost = `*${pickRandom(['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'])}%*`
let boost2 = `*${pickRandom(['21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'])}%*`
let boost3 = `*${pickRandom(['41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60'])}%*`
let boost4 = `*${pickRandom(['61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80'])}%*`
let boost5 = `*${pickRandom(['81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'])}%*`
const { key } = await conn.sendMessage(m.chat, { text: `${start}` }, { quoted: m })
await delay(1000)
await conn.sendMessage(m.chat, { text: `${boost}`, edit: key })
await delay(1000)
await conn.sendMessage(m.chat, { text: `${boost2}`, edit: key })
await delay(1000)
await conn.sendMessage(m.chat, { text: `${boost3}`, edit: key })
await delay(1000)
await conn.sendMessage(m.chat, { text: `${boost4}`, edit: key })
await delay(1000)
await conn.sendMessage(m.chat, { text: `${boost5}`, edit: key })
let doxeo = `🎀 *Doxed person*\n\n✦ ${new Date().toLocaleDateString()}\n✧ ${new Date().toLocaleTimeString()}\n\n✰ Results:\n\n*Name:* ${userName}\n*Ip:* 92.28.211.234\n*N:* 43 7462\n*W:* 12.4893\n*SS NUMBER:* 6979191519182016\n*IPV6:* fe80::5dcd::ef69::fb22::d9888%12\n*UPNP:* Enabled\n*DMZ:* 10.112.42.15\n*MAC:* 5A:78:3E:7E:00\n*ISP:* Ucom universal \n*DNS:* 8.8.8.8\n*ALT DNS:* 1.1.1.1 \n*DNS SUFFIX:* Dlink\n*WAN:* 100.23.10.15\n*WAN TYPE:* private nat\n*GATEWAY:* 192.168.0.1\n*SUBNET MASK:* 255.255.0.255\n*UDP OPEN PORTS:* 8080, 80\n*TCP OPEN PORTS:* 443\n*ROUTER VENDEDOR:* ERICCSON\n*DEVICE VENDEDOR:* WIN32-X\n*CONNECTION TYPE:* TPLINK COMPANY\n*ICMPHOPS:* 192.168.0.1, 192.168.1.1, 100.73.43.4\nhost-132.12.32.167.ucom.com\nhost-132.12.111.ucom.com\n36.134.67.189, 216.239.78.11\nSof02s32inf14.1e100.net\n*HTTP:* 192.168.3.1:433-->92.28.211.234:80\n*Http:* 192.168.625-->92.28.211.455:80\n*Http:* 192.168.817-->92.28.211.8:971\n*Upd:* 192.168.452-->92.28.211:7265288\n*Tcp:* 192.168.682-->92.28.211:62227.7\n*Tcp:* 192.168.725-->92.28.211:67wu2\n*Tcp:* 192.168.629-->92.28.211.167:8615\n*EXTERNAL MAC:* 6U:77:89:ER:O4\n*MODEM JUMPS:* 64`
await conn.sendMessage(m.chat, { text: doxeo, edit: key, mentions: conn.parseMention(doxeo) }, { quoted: m })
}} catch (error) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`, m)
}}

handler.help = ['top', 'sorteo', 'ship', 'shippear', 'afk', 'personalidad', 'formacouple', 'gay', 'lesbian', 'wanker', 'asshole', 'hoe', 'bitch', 'sucker', 'sucking', 'rate', 'prostitute', 'prostitute', 'doxing', 'doxing', 'doxxing']
handler.tags = ['fun']
handler.command = handler.help
handler.group = true

export default handler
