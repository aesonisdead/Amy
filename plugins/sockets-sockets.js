import { jidDecode } from '@whiskeysockets/baileys'
import path from 'path'
import fs from 'fs'
import ws from 'ws'

const linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
const handler = async (m, { conn, command, usedPrefix, text }) => {
try {
const isSubBots = [conn.user.jid, ...global.owner.map(number => `${number}@s.whatsapp.net`)].includes(m.sender)
if (!isSubBots) return m.reply(`❀ The command *${command}* can only be executed by the owner.`)
switch (command) {
case 'self': case 'public': case 'private': case 'antiprivate': case 'gponly': case 'sologp': {
const config = global.db.data.settings[conn.user.jid]
const value = text ? text.trim().toLowerCase() : ''
const type = /self|public/.test(command) ? 'self' : /private|antiprivate/.test(command) ? 'antiPrivate' : /gponly|sologp/.test(command) ? 'gponly' : null
if (!type) return m.reply(`ꕥ Mode not recognized.`)
const isEnable = config[type] || false
const enable = value === 'enable' || value === 'on'
const disable = value === 'disable' || value === 'off'
if (enable || disable) {
if (isEnable === enable)
return m.reply(`ꕥ The mode *${type}* was already ${enable ? 'activated' : 'disabled'}.`)
config[type] = enable
return conn.reply(m.chat, `❀ *${enable ? 'activated' : 'deactivated'}* the mode *${type}* by the owner.`, m)
}
conn.reply(m.chat, `「✦」You can turn the mode on or off *${type}* using:\n\n● Activate » ${usedPrefix}${command} enable\n● Deactivate » ${usedPrefix}${command} disable\n\n✧ Current status » *${isEnable ? '✓ Activated' : '✗ Deactivated'}*`, m)
break
}
case 'join': case 'j': {
if (!text) return m.reply(`❀ You must send an invitation link to join a group..`)
const [_, code] = text.match(linkRegex) || []
if (!code) return m.reply(`ꕥ The invitation link is not valid.`)
await m.react('🕒')
await conn.groupAcceptInvite(code)
await m.react('✔️')
m.reply(`❀ ${botname} successfully joined the group.`)
break
}
case 'l': case 'leave': {
await m.react('🕒')
const id = text || m.chat
const chat = global.db.data.chats[m.chat]
chat.welcome = false
await conn.reply(id, `❀ Goodbye everyone, ${botname} says goodbye! (≧ω≦)ゞ`)
await conn.groupLeave(id)
chat.welcome = true
await m.react('✔️')
break
}
case 'logout': {
const rawId = conn.user?.id || ''
const cleanId = jidDecode(rawId)?.user || rawId.split('@')[0]
const index = global.conns?.findIndex(c => c.user.jid === m.sender)
if (global.conn.user.jid === conn.user.jid)
return conn.reply(m.chat, '❀ This command is disabled in main sessions.', m)
if (index === -1 || !global.conns[index])
return conn.reply(m.chat, '⚠︎ The session is already closed or an active connection was not found.', m)
conn.reply(m.chat, '✩ Your session has been successfully closed.', m)
setTimeout(async () => {
await global.conns[index].logout()
global.conns.splice(index, 1)
const sessionPath = path.join(global.jadi, cleanId)
if (fs.existsSync(sessionPath)) {
fs.rmSync(sessionPath, { recursive: true, force: true })
console.log(`⚠︎ Sesión de ${cleanId} eliminada de ${sessionPath}`)
}}, 3000)
break
}
case 'reload': {
const rawId = conn.user?.id || ''
const cleanId = jidDecode(rawId)?.user || rawId.split('@')[0]
const sessionPath = path.join(global.jadi, cleanId)
if (!fs.existsSync(sessionPath)) return conn.reply(m.chat, '❀ This command can only be executed from a Sub-Bot instance.', m)
await m.react('🕒')
if (typeof global.reloadHandler !== 'function')
throw new Error('The global.reloadHandler function was not found.')
await global.reloadHandler(true)
await m.react('✔️')
conn.reply(m.chat, '✿ The session was successfully reloaded.', m)
break
}}} catch (error) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* para informarlo.\n\n${error.message || error}`, m)
}}

handler.command = ['self', 'public', 'antiprivate', 'gponly', 'sologp', 'join', 'j', 'l', 'leave', 'logout', 'reload']
handler.help = ['self', 'public', 'antiprivate', 'gponly', 'sologp', 'join', 'j', 'l', 'leave', 'logout', 'reload']
handler.tags = ['socket']

export default handler
