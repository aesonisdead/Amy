let handler = async (m, { conn, usedPrefix, command }) => {
let isClose = { 'open': 'not_announcement', 'o': 'not_announcement', 'close': 'announcement', 'cs': 'announcement', }[command]
await conn.groupSettingUpdate(m.chat, isClose)
if (isClose === 'not_announcement') {
m.reply(`❀ *Ya pueden escribir en este grupo.*`)
} else if (isClose === 'announcement') {
m.reply(`❀ *Sólo los admins pueden escribir en este grupo.*`)
}}

handler.help = ['open', 'close', 'o', 'cs']
handler.tags = ['group']
handler.command = ['open', 'close', 'o', 'cs']
handler.admin = true
handler.botAdmin = true

export default handler
