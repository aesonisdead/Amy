import ws from 'ws'

const handler = async (m, { conn }) => {
const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn.user.jid)])]
if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
subBots.push(global.conn.user.jid)
}
const chat = global.db.data.chats[m.chat]
const mentionedJid = await m.mentionedJid
const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : false
if (!who) return conn.reply(m.chat, `❀ Please mention a Socket to be assigned as the *Main Bot* of the group ✨`, m)
if (!subBots.includes(who)) return conn.reply(m.chat, `ꕥ The mentioned user is not a Socket of: *${botname}*.`, m)
if (chat.primaryBot === who) {
return conn.reply(m.chat, `ꕥ @${who.split`@`[0]} Is now the primary bot in this group..`, m, { mentions: [who] });
}
try {
chat.primaryBot = who
conn.reply(m.chat, `❀ It has been established that @${who.split`@`[0]} is the new primary bot of this group.\n> Now all commands in this group will be executed by @${who.split`@`[0]}.`, m, { mentions: [who] })
} catch (e) {
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${e.message}`, m)
}}

handler.help = ['setprimary']
handler.tags = ['group']
handler.command = ['setprimary']
handler.group = true
handler.admin = true

export default handler
