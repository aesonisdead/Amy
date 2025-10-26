const handler = async (m, { conn, text, usedPrefix, command, args, isROwner }) => {
if (!isROwner) return
const bot = conn.user.jid.split('@')[0]
const users = global.db.data.users
const chats = global.db.data.chats
function no(number) { return number.replace(/\s/g, '').replace(/([@+-])/g, '') }
try {
let mentionedJid = await m.mentionedJid
let who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : text ? no(text.split(' ')[0]) + '@s.whatsapp.net' : false
switch (command) {
case 'ban': {
if (!who) return conn.reply(m.chat, '❀ Please tag, quote or write the number of the user you want to ban from the Bot.', m)
var reason = 'Unspecified'
if (mentionedJid && mentionedJid[0]) {
var mentionIdx = args.findIndex(arg => arg.startsWith('@'))
var reasonArgs = args.slice(mentionIdx + 1).join(' ')
if (reasonArgs.trim()) reason = reasonArgs.trim()
} else if (m.quoted) {
if (args.length) reason = args.join(' ')
} else if (text) {
var parts = text.trim().split(' ')
if (parts.length > 1) reason = parts.slice(1).join(' ')
}
if (who === conn.user.jid) return conn.reply(m.chat, `ꕥ @${bot} Cannot be banned.`, m, { mentions: [who] })
if (global.owner.some(function (x) { return who === x[0] + '@s.whatsapp.net' })) {
return conn.reply(m.chat, `ꕥ I can't ban the owner @${who.split('@')[0]} de *@${bot}*.`, m, { mentions: [who, bot] })
}
if (!users[who]) users[who] = {}
if (users[who].banned) return conn.reply(m.chat, `ꕥ @${who.split('@')[0]} is already banned.`, m, { mentions: [who] })
await m.react('🕒')
users[who].banned = true
users[who].bannedReason = reason
var nameBan = await conn.getName(who)
await m.react('✔️')
await conn.reply(m.chat, `❀ ${nameBan} has been banned.\n> Reason: ${reason}`, m, { mentions: [who] })
await conn.reply(`${suittag}@s.whatsapp.net`, `❀ ${nameBan} was banned by ${await conn.getName(m.sender)}\n> ✦ Reason: ${reason}`, m)
break
}
case 'unban': {
if (!who) return conn.reply(m.chat, '❀ Please tag or enter the number of the user you want to unban from the Bot.', m)
if (!users[who]) return m.reply('❀ The user is not registered.', m)
if (!users[who].banned) return m.reply(`ꕥ @${who.split('@')[0]} is not banned.`, m, { mentions: [who] })
await m.react('🕒')
users[who].banned = false
users[who].bannedReason = ''
await m.react('✔️')
let nameUnban = await conn.getName(who)
await conn.reply(m.chat, `❀ ${nameUnban} has been unbanned.`, m, { mentions: [who] })
await conn.reply(`${suittag}@s.whatsapp.net`, `❀ ${nameUnban} was unbanned by ${await conn.getName(m.sender)}.`, m)
break
}
case 'block': {
if (!who) return conn.reply(m.chat, '❀ Please mention the user you want to block from the Bot number.', m)
await m.react('🕒')
await conn.updateBlockStatus(who, 'block')
await m.react('✔️')
conn.reply(m.chat, `❀ Successfully blocked @${who.split('@')[0]}`, m, { mentions: [who] })
break
}
case 'unblock': {
if (!who) return conn.reply(m.chat, '❀ Please mention the user you want to unblock from the Bot number.', m)
await m.react('🕒')
await conn.updateBlockStatus(who, 'unblock')
await m.react('✔️')
conn.reply(m.chat, `❀ Successfully unblocked @${who.split('@')[0]}`, m, { mentions: [who] })
break
}
case 'banlist': {
await m.react('🕒')
const bannedUsers = Object.entries(users).filter(([_, data]) => data.banned)
const bannedChats = Object.entries(chats).filter(([_, data]) => data.isBanned)
const usersList = bannedUsers.map(([jid]) => {
const num = jid.split('@')[0]
return `▢ @${num}`
})
const chatsList = bannedChats.map(([jid]) => {
return `▢ ${jid}`
})
const bannedText = `✦ Banned Users • Total: ${bannedUsers.length}\n${usersList.join('\n')}\n\n✧ Banned Chats • Total: ${bannedChats.length}\n${chatsList.join('\n')}`.trim()
const mentions = [...bannedUsers.map(([jid]) => jid), ...bannedChats.map(([jid]) => jid)]
await m.react('✔️')
conn.reply(m.chat, bannedText, m, { mentions })
break
}
case 'blocklist': {
await m.react('🕒')
const blocklist = await conn.fetchBlocklist()
let listText = `≡ *Blocked list*\n\n*Total :* ${blocklist.length}\n\n┌─⊷\n`
for (const i of blocklist) {
let num = i.split('@')[0]
listText += `▢ @${num}\n`
}
listText += '└───────────'
await m.react('✔️')
conn.reply(m.chat, listText, m, { mentions: blocklist })
break
}}} catch (e) {
await m.react('✖️')
return m.reply(`⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n` + (e.message || e))
}}

handler.help = ['ban', 'unban', 'block', 'unblock', 'banlist', 'blocklist']
handler.tags = ['mods']
handler.command = ['ban', 'unban', 'block', 'unblock', 'banlist', 'blocklist']

export default handler
