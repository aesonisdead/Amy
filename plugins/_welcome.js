import fs from 'fs'
import { WAMessageStubType } from '@whiskeysockets/baileys'

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
const username = `@${userId.split('@')[0]}`
const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg')
const fecha = new Date().toLocaleDateString("en-US", { timeZone: "Africa/Casablanca", day: 'numeric', month: 'long', year: 'numeric' })
const groupSize = groupMetadata.participants.length + 1
const desc = groupMetadata.desc?.toString() || 'No description'
const mensaje = (chat.sWelcome || '૮꒰ ˶• ᴗ •˶꒱ა Enjoy your stay in the group!\n\n> 🎀 Personalize this message using: */setwelcome*').replace(/{user}/g, `${username}`).replace(/{group}/g, `*${groupMetadata.subject}*`).replace(/{desc}/g, `${desc}`)
const caption = `
╭───·˚ 🐝 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🐝 ·˚───╮

  𐔌՞. .՞𐦯 ¡Hola, ${username}  
  Welcome to: *${groupMetadata.subject}*

${mensaje}
  
╰──·˚ 🌷 ¡Enjoy your stay! ˚·──╯`
return { pp, caption, mentions: [userId] }
}
async function generarDespedida({ conn, userId, groupMetadata, chat }) {
const username = `@${userId.split('@')[0]}`
const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg')
const fecha = new Date().toLocaleDateString("en-US", { timeZone: "Africa/Casablanca", day: 'numeric', month: 'long', year: 'numeric' })
const groupSize = groupMetadata.participants.length - 1
const desc = groupMetadata.desc?.toString() || 'No description'
const mensaje = (chat.sBye || '-1 homosexual 🥺\n\n> 🎀 Personalize this message using: */setbye*').replace(/{user}/g, `${username}`).replace(/{group}/g, `${groupMetadata.subject}`).replace(/{desc}/g, `*${desc}*`)
const caption = `
╭───·˚ 🐝 𝐆𝐎𝐎𝐃 𝐁𝐘𝐄 🐝 ·˚───╮

  𐔌՞. .՞𐦯 – ${username}  
  Left: *${groupMetadata.subject}*

${mensaje}
  
╰───·˚  🌷 ¡See you soon!  ˚·───╯`
return { pp, caption, mentions: [userId] }
}
let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return !0
const primaryBot = global.db.data.chats[m.chat].primaryBot
if (primaryBot && conn.user.jid !== primaryBot) throw !1
const chat = global.db.data.chats[m.chat]
const userId = m.messageStubParameters[0]
if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
const { pp, caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat })
rcanal.contextInfo.mentionedJid = mentions
await conn.sendMessage(m.chat, { image: { url: pp }, caption, ...rcanal }, { quoted: null })
try { fs.unlinkSync(img) } catch {}
}
if (chat.welcome && (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
const { pp, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat })
rcanal.contextInfo.mentionedJid = mentions
await conn.sendMessage(m.chat, { image: { url: pp }, caption, ...rcanal }, { quoted: null })
try { fs.unlinkSync(img) } catch {}
}}

export { generarBienvenida, generarDespedida }
export default handler
