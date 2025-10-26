const handler = async (m, { conn, isAdmin, groupMetadata, usedPrefix, isBotAdmin, isROwner }) => {
if (!isROwner) return
if (!isBotAdmin) return
if (isAdmin) return m.reply(`❀ You already have administrator privileges.`)
try {
await m.react('🕒')
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
await m.react('✔️')
m.reply(`❀ You have been successfully added as a group admin..`)
} catch (error) {
await m.react('✖️')
m.reply(`⚠︎ A problem has occurred\n> Use *${usedPrefix}report* to report it\n\n${error.message}`)
}}

handler.tags = ['owner']
handler.help = ['autoadmin']
handler.command = ['autoadmin']
handler.group = true

export default handler
