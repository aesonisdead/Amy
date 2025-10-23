export async function before(m, { conn, isAdmin, isBotAdmin, isROwner }) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.sender === conn.user?.jid) return
if (m.text.includes('ROCK') || m.text.includes('PAPER') || m.text.includes('SCISSORS') || m.text.includes('code') || m.text.includes('qr')) return !0
const chat = global.db.data.chats[m.chat]
const bot = global.db.data.settings[conn.user.jid] || {}
if (m.chat === '120363420610572685@newsletter') return !0
if (bot.antiPrivate && !isROwner) {
await m.reply(`ꕥ Hello @${m.sender.split`@`[0]}, My owner has disabled the commands in private chats which will block you, If you want to use the bot commands, I invite you to join our community..\n\n${community}`, false, {mentions: [m.sender]})
await this.updateBlockStatus(m.chat, 'block')
}
return !1
}
