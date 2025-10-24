const handler = async (m, { args, conn, usedPrefix }) => {
try {
if (!args[0]) return conn.reply(m.chat, `❀ Please enter an Instagram/Facebook link..`, m)
let data = []
try {
await m.react('🕒')
const api = `${global.APIs.vreden.url}/api/igdownload?url=${encodeURIComponent(args[0])}`
const res = await fetch(api)
const json = await res.json()
if (json.resultado?.respuesta?.datos?.length) {
data = json.resultado.respuesta.datos.map(v => v.url)
}} catch {}
if (!data.length) {
try {
const api = `${global.APIs.delirius.url}/download/instagram?url=${encodeURIComponent(args[0])}`
const res = await fetch(api)
const json = await res.json()
if (json.status && json.data?.length) {
data = json.data.map(v => v.url)
}} catch {}
}
if (!data.length) return conn.reply(m.chat, `ꕥ The content could not be obtained.`, m)
for (let media of data) {
await conn.sendFile(m.chat, media, 'instagram.mp4', `❀ Here you go ฅ^•ﻌ•^ฅ.`, m)
await m.react('✔️')
}} catch (error) {
await m.react('✖️')
await m.reply(`⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`)
}}

handler.command = ['instagram', 'ig', 'facebook', 'fb']
handler.tags = ['media']
handler.help = ['instagram', 'ig', 'facebook', 'fb']
handler.group = true

export default handler
