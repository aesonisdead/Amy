let handler = async (m, { conn, usedPrefix, command, args }) => {
let chat = global.db.data.chats[m.chat]
if (command === 'bot') {
if (args.length === 0) {
const estado = chat.isBanned ? '✗ Deactivated' : '✓ Activated'
const info = `「✦」An administrator can enable or disable *${botname}* using:\n\n✐ _Activate_ » *${usedPrefix}bot enable*\n✐ _Deactivate_ » *${usedPrefix}bot disable*\n\n✧ Current status » *${estado}*`
return conn.reply(m.chat, info, m)
}
if (args[0] === 'off') {
if (chat.isBanned) {
return conn.reply(m.chat, `《✦》${botname} is already disabled.`, m)
}
chat.isBanned = true
return conn.reply(m.chat, `❀ You have *deactivated* ${botname}!`, m)
} else if (args[0] === 'on') {
if (!chat.isBanned) {
return conn.reply(m.chat, `《✦》${botname} is already activated.`, m)
}
chat.isBanned = false
return conn.reply(m.chat, `❀ You have *activated* ${botname}!`, m)
}}}

handler.help = ['bot']
handler.tags = ['group']
handler.command = ['bot']
handler.admin = true

export default handler
