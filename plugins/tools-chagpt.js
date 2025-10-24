import FormData from "form-data"
import { fileTypeFromBuffer } from "file-type"
import axios from "axios"
import fetch from "node-fetch"

const handler = async (m, { conn, command, usedPrefix, text, args }) => {
try {
const q = m.quoted ? m.quoted : m
const mime = (q.msg || q).mimetype || ''
const username = await (async () => global.db.data.users[m.sender].name || (async () => { try { const n = await conn.getName(m.sender); return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })())()
switch (command) {
case 'dalle': {
if (!args[0]) return conn.reply(m.chat, `❀ Please provide a description to generate the image.`, m)
const promptDalle = args.join(' ')
if (promptDalle.length < 5) return conn.reply(m.chat, `ꕥ The description is too short.`, m)
await m.react('🕒')
const dalleURL = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(promptDalle)}`
const dalleRes = await axios.get(dalleURL, { responseType: 'arraybuffer' })
await conn.sendMessage(m.chat, { image: Buffer.from(dalleRes.data) }, { quoted: m })
await m.react('✔️')
break
}
case 'flux': {
if (!text) return conn.reply(m.chat, `❀ Please enter a term to generate the image`, m)
await m.react('🕒')
const result = await fluximg.create(text)
if (result?.imageLink) {
await conn.sendMessage(m.chat, { image: { url: result.imageLink }, caption: `❀ *Resultados de:* ${text}` }, { quoted: m })
await m.react('✔️')
} else throw new Error("Could not create image")
break
}
case 'ai': case 'chatgpt': {
if (!text) return conn.reply(m.chat, `❀ Submit a petition.`, m)
await m.react('🕒')
const basePrompt = `Your name is ${botname} and appears to have been created by ${etiqueta}. Your current version is ${vs}, You use the English language. You will call people by their name. ${username}, you like to be cute, and you love to learn. The most important thing is that you should be friendly with the person you are talking to. ${username}`
const url = `${global.APIs.delirius.url}/ia/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(basePrompt)}`
const res = await axios.get(url)
if (!res.data?.status || !res.data?.data) throw new Error('Invalid Delirius Response')
await conn.sendMessage(m.chat, { text: res.data.data }, { quoted: m })
await m.react('✔️')
break
}
case 'luminai': case 'gemini': case 'bard': {
if (!text) return conn.reply(m.chat, `❀ Submit a petition.`, m)
await m.react('🕒')
const apiMap = { luminai: 'qwen-qwq-32b', gemini: 'gemini', bard: 'grok-3-mini' }
const endpoint = apiMap[command]
const url = `${global.APIs.zenzxz.url}/ai/${endpoint}?text=${encodeURIComponent(text)}`
const res = await axios.get(url)
const output = res.data?.response || res.data?.assistant
if (!res.data?.status || !output) throw new Error(`Invalid response from ${command}`)
await conn.sendMessage(m.chat, { text: output }, { quoted: m })
await m.react('✔️')
break
}}} catch (error) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`, m)
}}

handler.command = ['gemini', 'bard', 'openai', 'dalle', 'flux', 'ai', 'chatgpt', 'luminai']
handler.help = ['gemini', 'bard', 'openai', 'dalle', 'flux', 'ai', 'chatgpt', 'luminai']
handler.tags = ['tools']
handler.group = true

export default handler

const fluximg = { defaultRatio: "2:3", create: async (query) => {
const config = { headers: { accept: "*/*", authority: "1yjs1yldj7.execute-api.us-east-1.amazonaws.com", "user-agent": "Postify/1.0.0" }}
const url = `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(query)}&aspect_ratio=${fluximg.defaultRatio}`
const res = await axios.get(url, config)
return { imageLink: res.data.image_link }
}}
