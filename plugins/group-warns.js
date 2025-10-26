import db from '../lib/database.js'

const handler = async (m, { conn, text, command, usedPrefix }) => {
try {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://files.catbox.moe/mq2yh8.jpg')
let mentionedJid = await m.mentionedJid
let who = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
const user = global.db.data.users[m.sender]
const usuario = conn.user.jid.split`@`[0] + '@s.whatsapp.net'
const groupInfo = await conn.groupMetadata(m.chat)
const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
switch (command) {
case 'advertencia': case 'warn': case 'addwarn': {
if (!who || typeof who !== 'string' || !who.includes('@')) {
return m.reply(`❀ You must mention or quote an user's message to apply a warning.\n> Example: *${usedPrefix + command} @user (reason | optional)*`)
}
const msgtext = text?.trim() || ''
const partes = msgtext.split(/\s+/)
const tieneMencion = partes.some(part => part.startsWith('@'))
const motivo = tieneMencion ? partes.filter(part => !part.startsWith('@')).join(' ').trim() || 'Unspecified' : msgtext || 'Unspecified'
if (who === conn.user.jid) return conn.reply(m.chat, `ꕥ I can't give the bot warnings.`, m)
if (who === ownerGroup) return conn.reply(m.chat, `ꕥ I can't give warnings to the group owner..`, m)
if (who === ownerBot) return conn.reply(m.chat, `ꕥ I can't give warnings to the bot owner.`, m)
user.warn = (user.warn || 0) + 1
await m.reply(`*@${who.split`@`[0]}* You received a warning in this group!\nReason: ${motivo}\n*Warnings: ${user.warn}/3*`, null, { mentions: [who] })
if (user.warn >= 3) {
user.warn = 0
await m.reply(`❀ I warned you several times!\n*@${who.split`@`[0]}* Exceeded *3* warnings, will now be removed/a.`, null, { mentions: [who] })
await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
}
break
}
case 'delwarn': case 'unwarn': {
if (!who) return m.reply(`❀ Tag an user to remove warnings.`)
if (mentionedJid.includes(conn.user.jid)) return
if (user.warn === 0) throw `ꕥ The user has 0 warnings.`
user.warn -= 1
await m.reply(`${user.warn === 1 ? `*@${who.split`@`[0]}*` : `❀ *@${who.split`@`[0]}*`} A warning was removed.\n*WARNINGS ${user.warn}/3*`, null, { mentions: [who] })
break
}
case 'listwrn': case 'wrnlist': {
const adv = Object.entries(global.db.data.chats[m.chat].users).filter(([_, u]) => u.warn)
const warns = global.db.data.chats[m.chat].users.warn || 0
const listadvs = `❀ Warned Users\n\n*Total : ${adv.length} Users*${adv.length > 0 ? '\n' + adv.map(([jid, user]) => `*●* @${jid.split`@`[0]} : *(${user.warn}/3)*`).join('\n') : ''}\n\n⚠︎ Warnings ⇢ *${warns ? `${warns}/3` : '0/3'}*`
await conn.sendMessage(m.chat, { image: { url: pp }, caption: listadvs, mentions: await conn.parseMention(listadvs) }, { quoted: m })
break
}}} catch (error) {
m.reply(`⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`)
}}

handler.command = ['addvertencia', 'warn', 'addwarn', 'delwarn', 'unwarn', 'listwrn', 'wrnlist']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
