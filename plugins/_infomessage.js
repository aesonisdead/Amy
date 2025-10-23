let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const groupMetadataCache = new Map()
const lidCache = new Map()
const handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return
const primaryBot = global.db.data.chats[m.chat].primaryBot
if (primaryBot && conn.user.jid !== primaryBot) throw !1
const chat = global.db.data.chats[m.chat]
const users = m.messageStubParameters[0]
const usuario = await resolveLidToRealJid(m?.sender, conn, m?.chat)
const groupAdmins = participants.filter(p => p.admin)
const rcanal = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, serverMessageId: '', newsletterName: channelRD.name }, externalAdReply: { title: "⸝⸝　 ꒰　A V I S O　꒱  ⁞　ˎˊ˗", body: textbot, mediaUrl: null, description: null, previewType: "PHOTO", thumbnail: await (await fetch(icono)).buffer(), sourceUrl: redes, mediaType: 1, renderLargerThumbnail: false }, mentionedJid: null }}
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/sxccco.png'
const nombre = `🌸✨ ¡NEW NAME! ✨🌸\n\n
@${usuario.split('@')[0]} decided to give it a new name.
💌 Now it's called: *${m.messageStubParameters[0]}*`;
const foto = `🖼️🌷 ¡Updated photo! 🌷🖼️\n\n
👀 Action done by: @${usuario.split('@')[0]}`
const edit = `🔧✨ Group settings ✨🔧\n\n
@${usuario.split('@')[0]} has decided that ${m.messageStubParameters[0] == 'on' ? 'only admins 🌟' : 'all members 🌼'} can modify the group.`
const newlink = `🔗💫 ¡Updated group link! 💫🔗\n\n
✦ Thank you : @${usuario.split('@')[0]}\n
Now everyone can join again 🌸`
const status = `🚦🌸 Group status 🌸🚦\n\n
The group has been ${m.messageStubParameters[0] == 'on' ? '*closed* 🔒' : '*open* 🔓'}.\n
✦ Por: @${usuario.split('@')[0]}\n
🌿 ${m.messageStubParameters[0] == 'on' ? 'Only admins can send messages' : 'Everyone can send messages'}`
const admingp = `🌟✨ ¡New Admin! ✨🌟\n\n
@${users.split('@')[0]} is now admin of the group.\n
🖇️ Action taken by: @${usuario.split('@')[0]} 💖`
const noadmingp = `🌸⚡ ¡Admin removed! ⚡🌸\n\n
@${users.split('@')[0]} no longer has admin permissions.\n
🖇️ Action taken by: @${usuario.split('@')[0]} 💌`
if (chat.detect && m.messageStubType == 2) {
const uniqid = (m.isGroup ? m.chat : m.sender).split('@')[0]
const sessionPath = `./${sessions}/`
for (const file of await fs.promises.readdir(sessionPath)) {
if (file.includes(uniqid)) {
await fs.promises.unlink(path.join(sessionPath, file))
console.log(`${chalk.yellow.bold('✎ Delete!')} ${chalk.greenBright(`'${file}'`)}\n${chalk.redBright('What causes the "undefined" in the chat?.')}`)
}}} if (chat.detect && m.messageStubType == 21) {
rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
await this.sendMessage(m.chat, { text: nombre, ...rcanal }, { quoted: null })
} if (chat.detect && m.messageStubType == 22) {
rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, ...rcanal }, { quoted: null })
} if (chat.detect && m.messageStubType == 23) {
rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
await this.sendMessage(m.chat, { text: newlink, ...rcanal }, { quoted: null })
} if (chat.detect && m.messageStubType == 25) {
rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
await this.sendMessage(m.chat, { text: edit, ...rcanal }, { quoted: null })
} if (chat.detect && m.messageStubType == 26) {
rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
await this.sendMessage(m.chat, { text: status, ...rcanal }, { quoted: null })
} if (chat.detect && m.messageStubType == 29) {
rcanal.contextInfo.mentionedJid = [usuario, users, ...groupAdmins.map(v => v.id)].filter(Boolean)
await this.sendMessage(m.chat, { text: admingp, ...rcanal }, { quoted: null })
return
} if (chat.detect && m.messageStubType == 30) {
rcanal.contextInfo.mentionedJid = [usuario, users, ...groupAdmins.map(v => v.id)].filter(Boolean)
await this.sendMessage(m.chat, { text: noadmingp, ...rcanal }, { quoted: null })
} else { 
if (m.messageStubType == 2) return
console.log({messageStubType: m.messageStubType,
messageStubParameters: m.messageStubParameters,
type: WAMessageStubType[m.messageStubType], 
})}}

export default handler

async function resolveLidToRealJid(lid, conn, groupChatId, maxRetries = 3, retryDelay = 60000) {
const inputJid = lid.toString()
if (!inputJid.endsWith("@lid") || !groupChatId?.endsWith("@g.us")) { return inputJid.includes("@") ? inputJid : `${inputJid}@s.whatsapp.net` }
if (lidCache.has(inputJid)) { return lidCache.get(inputJid) }
const lidToFind = inputJid.split("@")[0]
let attempts = 0
while (attempts < maxRetries) {
try {
const metadata = await conn?.groupMetadata(groupChatId)
if (!metadata?.participants) { throw new Error("No se obtuvieron participantes") }
for (const participant of metadata.participants) {
try {
if (!participant?.jid) continue
const contactDetails = await conn?.onWhatsApp(participant.jid)
if (!contactDetails?.[0]?.lid) continue
const possibleLid = contactDetails[0].lid.split("@")[0]
if (possibleLid === lidToFind) {
lidCache.set(inputJid, participant.jid)
return participant.jid
}} catch (e) { continue }}
lidCache.set(inputJid, inputJid)
return inputJid
} catch (e) {
if (++attempts >= maxRetries) {
lidCache.set(inputJid, inputJid)
return inputJid
}
await new Promise((resolve) => setTimeout(resolve, retryDelay))
}}
return inputJid
}
