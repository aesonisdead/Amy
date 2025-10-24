import path from "path"
import { File } from "megajs"

const handler = async (m, { conn, args, usedPrefix, command, text }) => {
if (!text) {
return conn.reply(m.chat, `❀ Please send a MEGA link to download the file..`, m)
}
try {
await m.react('🕒')
const file = File.fromURL(text)
await file.loadAttributes()
let maxSize = 300 * 1024 * 1024;
if (file.size >= maxSize) {
return conn.reply(m.chat, `ꕥ The file is too large (Maximum size: 300MB).`, m)
}
let cap = `*乂 MEGA - DOWNLOADER! 乂*

≡ Name : ${file.name}
≡ Size : ${formatBytes(file.size)}
≡ URL: ${text}`
m.reply(cap)
const data = await file.downloadBuffer()
const fileExtension = path.extname(file.name).toLowerCase()
const mimeTypes = {
".mp4": "video/mp4",
".pdf": "application/pdf",
".zip": "application/zip",
".rar": "application/x-rar-compressed",
".7z": "application/x-7z-compressed",
".jpg": "image/jpeg",
".jpeg": "image/jpeg",
".png": "image/png",
}
let mimetype = mimeTypes[fileExtension] || "application/octet-stream"
await conn.sendFile(m.chat, data, file.name, "", m, null, { mimetype, asDocument: true })
await m.react('✔️')
} catch (e) {
await m.react('✖️')
return conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${e.message}`, m)
}}

handler.help = ["mega"]
handler.tags = ["media"]
handler.command = ["mega", "mg"]
handler.group = true

export default handler

function formatBytes(bytes) {
if (bytes === 0) return '0 Bytes'
const k = 1024
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
const i = Math.floor(Math.log(bytes) / Math.log(k))
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
