import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix }) => {
if (!text) return conn.reply(m.chat, `❀ Please enter a text to search for an image..`, m)
try {
await m.react('🕒')
const res = await getGoogleImageSearch(text)
const urls = await res.getAll()
if (urls.length < 2) return conn.reply(m.chat, '✧ Not enough images found for an album.', m)
const medias = urls.slice(0, 10).map(url => ({ type: 'image', data: { url } }))
const caption = `❀ Search results for: ${text}`
await conn.sendSylphy(m.chat, medias, { caption, quoted: m })
await m.react('✔️')
} catch (error) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`, m)
}}

handler.help = ['image']
handler.tags = ['media']
handler.command = ['img', 'image']

export default handler

function getGoogleImageSearch(query) {
const apis = [`${global.APIs.delirius.url}/search/gimage?query=${encodeURIComponent(query)}`, `${global.APIs.siputzx.url}/api/images?query=${encodeURIComponent(query)}`]
return { getAll: async () => {
for (const url of apis) {
try {
const res = await axios.get(url)
const data = res.data
if (Array.isArray(data?.data)) {
const urls = data.data.map(d => d.url).filter(u => typeof u === 'string' && u.startsWith('http'))
if (urls.length) return urls
}} catch {}
}
return []
},
getRandom: async () => {
const all = await this.getAll()
return all[Math.floor(Math.random() * all.length)] || null
}}}
