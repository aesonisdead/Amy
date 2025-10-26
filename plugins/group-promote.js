var handler = async (m, { conn, usedPrefix, command, text, groupMetadata, isAdmin }) => {
let mentionedJid = await m.mentionedJid
let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
if (!user) return conn.reply(m.chat, `❀ You must mention an user to be able to promote them to administrator.`, m)
try {
const groupInfo = await conn.groupMetadata(m.chat)
const ownerGroup = groupInfo.owner || m.chat.split('-')[0] + '@s.whatsapp.net'
if (user === ownerGroup || groupInfo.participants.some(p => p.id === user && p.admin))
return conn.reply(m.chat, 'ꕥ The mentioned user already has administrator privileges.', m)
await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
await conn.reply(m.chat, `❀ Successfully added as a group admin.`, m)
} catch (e) {
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${e.message}`, m)
}}

handler.help = ['promote']
handler.tags = ['group']
handler.command = ['promote', 'prom']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
