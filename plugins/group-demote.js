var handler = async (m, { conn, usedPrefix, command, text, groupMetadata }) => {
let mentionedJid = await m.mentionedJid
let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
if (!user) return conn.reply(m.chat, `❀ You must mention a user to be able to demote them from administrator.`, m)
try {
const groupInfo = await conn.groupMetadata(m.chat)
const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
if (user === conn.user.jid) return conn.reply(m.chat, `ꕥ You can't demote the bot.`, m)
if (user === ownerGroup) return conn.reply(m.chat, `ꕥ You cannot demote the group creator.`, m)
if (user === ownerBot) return conn.reply(m.chat, `ꕥ You cannot demote the bot owner.`, m)
await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
conn.reply(m.chat, `❀ User is now no longer an admin.`, m)
} catch (e) {
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${e.message}`, m)
}}

handler.help = ['demote']
handler.tags = ['group']
handler.command = ['demote', 'dem']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
