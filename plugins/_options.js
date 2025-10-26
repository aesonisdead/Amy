const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
const primaryBot = global.db.data.chats[m.chat].primaryBot
if (primaryBot && conn.user.jid !== primaryBot) throw !1
const chat = global.db.data.chats[m.chat]
let type = command.toLowerCase()
let isEnable = chat[type] !== undefined ? chat[type] : false
if (args[0] === 'on' || args[0] === 'enable') {
if (isEnable) return conn.reply(m.chat, `ꕥ *${type}* was already *activated*.`, m)
isEnable = true
} else if (args[0] === 'off' || args[0] === 'disable') {
if (!isEnable) return conn.reply(m.chat, `ꕥ *${type}* was already *deactivated*.`, m)
isEnable = false
} else {
return conn.reply(m.chat, `「✦」An administrator can enable or disable the *${command}* using:\n\n● _Activate_ » *${usedPrefix}${command} enable*\n● _Deactivate_ » *${usedPrefix}${command} disable*\n\nꕥ Current status » *${isEnable ? '✓ Activated' : '✗ Disabled'}*`, m)
}
switch (type) {
case 'welcome': case 'wlcm': {
if (!m.isGroup) {
if (!isOwner) {
global.dfail('group', m, conn)
throw false
}} else if (!isAdmin) {
global.dfail('admin', m, conn)
throw false
}
chat.welcome = isEnable
break
}
case 'modeadmin': case 'onlyadmin': {
if (!m.isGroup) {
if (!isOwner) {
global.dfail('group', m, conn)
throw false
}} else if (!isAdmin) {
global.dfail('admin', m, conn)
throw false
}
chat.modoadmin = isEnable
break
}
case 'detect': case 'alerts': {
if (!m.isGroup) {
if (!isOwner) {
global.dfail('group', m, conn)
throw false
}} else if (!isAdmin) {
global.dfail('admin', m, conn)
throw false
}
chat.detect = isEnable
break
}
case 'antilink': case 'atk': {
if (!m.isGroup) {
if (!isOwner) {
global.dfail('group', m, conn)
throw false
}} else if (!isAdmin) {
global.dfail('admin', m, conn)
throw false
}
chat.antiLink = isEnable
break
}
case 'nsfw': case 'modehorny': {
if (!m.isGroup) {
if (!isOwner) {
global.dfail('group', m, conn)
throw false
}} else if (!isAdmin) {
global.dfail('admin', m, conn)
throw false
}
chat.nsfw = isEnable
break
}
case 'economy': case 'eco': {
if (!m.isGroup) {
if (!isOwner) {
global.dfail('group', m, conn)
throw false
}} else if (!isAdmin) {
global.dfail('admin', m, conn)
throw false
}
chat.economy = isEnable
break
}
case 'rpg': case 'gacha': {
if (!m.isGroup) {
if (!isOwner) {
global.dfail('group', m, conn)
throw false
}} else if (!isAdmin) {
global.dfail('admin', m, conn)
throw false
}
chat.gacha = isEnable
break
}}
chat[type] = isEnable
conn.reply(m.chat, `❀ *${isEnable ? 'activated' : 'disabled'}* *${type}* for this group.`, m)
}

handler.help = ['welcome', 'wlcm', 'modeadmin', 'onlyadmin', 'nsfw', 'modehorny', 'economy', 'eco', 'rpg', 'gacha', 'detect', 'alerts', 'antilink', 'atk']
handler.tags = ['nable']
handler.command = ['welcome', 'wlcm', 'modeadmin', 'onlyadmin', 'nsfw', 'modehorny', 'economy', 'eco', 'rpg', 'gacha', 'detect', 'alerts', 'antilink', 'atk']
handler.group = true

export default handler
