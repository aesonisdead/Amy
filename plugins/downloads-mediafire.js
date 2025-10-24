import fetch from 'node-fetch'
import { lookup } from 'mime-types'

let handler = async (m, { conn, text, usedPrefix }) => {
if (!text) return conn.reply(m.chat, '❀ You forgot the Mediafire link.', m)
if (!/^https:\/\/www\.mediafire\.com\//i.test(text)) return conn.reply(m.chat, 'ꕥ Invalid link.', m)
try {
await m.react('🕒')
const res = await fetch(`${global.APIs.delirius.url}/download/mediafire?url=${encodeURIComponent(text)}`)
const json = await res.json()
const data = json.data
if (!json.status || !data?.filename || !data?.link) { throw 'ꕥ Could not get file from Delirius.' }
const filename = data.filename
const filesize = data.size || 'unknown'
const mimetype = data.mime || lookup(data.extension?.toLowerCase()) || 'application/octet-stream'
const dl_url = data.link.includes('u=') ? decodeURIComponent(data.link.split('u=')[1]) : data.link
const caption = `乂 MEDIAFIRE - DOWNLOADING 乂\n\n✩ Name » ${filename}\n✩ Size » ${filesize}\n✩ MimeType » ${mimetype}\n✩ Link » ${text}`
await conn.sendMessage(m.chat, { document: { url: dl_url }, fileName: filename, mimetype, caption }, { quoted: m })
await m.react('✔️')
} catch (e) {
await m.react('✖️')
return conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${e.message}`, m)
}}

handler.command = ['mf', 'mediafire']
handler.help = ['mediafire']
handler.tags = ['media']
handler.group = true
handler.premium = true

export default handler
