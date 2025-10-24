import { search, download } from 'aptoide-scraper'

var handler = async (m, { conn, usedPrefix, command, text }) => {
if (!text) return conn.reply(m.chat, `❀ Please enter the name of the apk to download it..`, m)
try {
await m.react('🕒')
let searchA = await search(text)
let data5 = await download(searchA[0].id)
let txt = `*乂  APTOIDE - DOWNLOADER 乂*\n\n`
txt += `≡ Name : ${data5.name}\n`
txt += `≡ Package : ${data5.package}\n`
txt += `≡ Update : ${data5.lastup}\n`
txt += `≡ Size :  ${data5.size}`
await conn.sendFile(m.chat, data5.icon, 'thumbnail.jpg', txt, m)
if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
return await conn.reply(m.chat, `ꕥ The file is too large.`, m)
}
await conn.sendMessage(m.chat, { document: { url: data5.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null }, { quoted: m })
await m.react('✔️')
} catch (error) {
await m.react('✖️')
return conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`, m)
}}

handler.tags = ['media']
handler.help = ['apkmod']
handler.command = ['apk', 'modapk', 'aptoide']
handler.group = true
handler.premium = true

export default handler
