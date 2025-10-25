import axios from "axios"

const handler = async (m, { conn, text, usedPrefix }) => {
if (!text) return m.reply("❀ Please provide the name of a song or artist..")
try {
await m.react('🕒')
const isUrl = /https?:\/\/(open\.)?spotify\.com\/track\/[a-zA-Z0-9]+/.test(text)
let trackUrl = text
let info = null
let data = null
if (!isUrl) {
const search = await axios.get(`${global.APIs.delirius.url}/search/spotify?q=${encodeURIComponent(text)}&limit=1`)
const result = Array.isArray(search.data?.data) ? search.data.data[0] : null
if (!result || !result.url) throw new Error("ꕥ No results found.")
trackUrl = result.url
info = { title: result.title || "Unknown", artist: result.artist || "Unknown", album: result.album || null, duration: result.duration || null, popularity: result.popularity || null, release: result.publish || null, image: result.image || null, url: result.url }}
const res = await axios.get(`${global.APIs.delirius.url}/download/spotifydl?url=${encodeURIComponent(trackUrl)}`)
const d = res.data?.data
if (!res.data?.status || !d?.url) throw new Error("ꕥ Could not get audio.")
data = { title: d.title || info?.title || "Unknown", artist: d.author || info?.artist || "Unknown", album: info?.album || "Unknown", duration: info?.duration || `${Math.floor(d.duration / 60000)}:${String(Math.floor((d.duration % 60000) / 1000)).padStart(2, '0')}`, popularity: info?.popularity || "Unknown", release: info?.release || "Unknown", type: d.type, source: d.source, image: d.image || info?.image, download: d.url, url: info?.url || trackUrl }
const caption = `「✦」Downloading *<${data.title}>*\n\n> ꕥ Author » *${data.artist}*\n${data.album && data.album !== "Unknown" ? `> ❑ Album » *${data.album}*\n` : ''}${data.duration ? `> ⴵ Duration » *${data.duration}*\n` : ''}${data.popularity && data.popularity !== "Unknown" ? `> ✰ Popularity » *${data.popularity}*\n` : ''}${data.release && data.release !== "Unknown" ? `> ☁︎ Published » *${data.release}*\n` : ''}${data.url ? `> 🜸 Link » ${data.url}` : ''}`
await conn.sendMessage(m.chat, {
text: caption,
contextInfo: {
externalAdReply: {
showAdAttribution: true,
containsAutoReply: true,
renderLargerThumbnail: true,
title: '✧ s⍴᥆𝗍і𝖿ᥡ • mᥙsіᥴ ✧',
body: dev,
mediaType: 1,
thumbnailUrl: data.image,
mediaUrl: data.url,
sourceUrl: data.url,
}}}, { quoted: m })
await conn.sendMessage(m.chat, { audio: { url: data.download }, fileName: `${data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
await m.react('✔️')
} catch (err) {
await m.react('✖️')
m.reply(`⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${err.message}`)
}}

handler.help = ["spotify"]
handler.tags = ["media"]
handler.command = ["spotify", "splay"]
handler.group = true

export default handler
