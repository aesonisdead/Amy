var handler = async (m, { conn, participants, usedPrefix, command }) => {
let mentionedJid = await m.mentionedJid
let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
if (!user) return conn.reply(m.chat, `❀ You must mention an user to be able to remove them from the group.`, m)
try {
const groupInfo = await conn.groupMetadata(m.chat)
const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
if (user === conn.user.jid) return conn.reply(m.chat, `ꕥ I can't remove the bot from the group.`, m)
if (user === ownerGroup) return conn.reply(m.chat, `ꕥ I can't remove the group owner.`, m)
if (user === ownerBot) return conn.reply(m.chat, `ꕥ I can't remove the bot owner.`, m)
await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
} catch (e) {
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${e.message}`, m)
}}

handler.help = ['kick']
handler.tags = ['group']
handler.command = ['kick', 'echar', 'hechar','sacar']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
