import yts from 'yt-search'

var handler = async (m, { text, conn, args, command, usedPrefix }) => {
if (!text) return conn.reply(m.chat, `❀ Por favor, ingresa una búsqueda de Youtube.`, m)
try {
await m.react('🕒')
let results = await yts(text)
let tes = results.all
let teks = results.all.map(v => {
switch (v.type) {
case 'video': return `「✦」Search results for *<${text}>*

❀ *${v.title}*
> ✦ Channel » *${v.author.name}*
> ⴵ Duration » *${v.timestamp}*
> ✐ Uploaded » *${v.ago}*
> ✰ Views » *${v.views}*
> 🜸 Link » ${v.url}`}}).filter(v => v).join('\n\n••••••••••••••••••••••••••••••••••••\n\n')
await conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg', teks, m)
await m.react('✔️')
} catch (e) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n` + e.message, m)
}}

handler.help = ['ytsearch']
handler.tags = ['media']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.group = true

export default handler
