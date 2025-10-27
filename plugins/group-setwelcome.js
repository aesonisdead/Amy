import fetch from 'node-fetch'
import fs from 'fs'
import { generarBienvenida, generarDespedida } from './_welcome.js'

const handler = async (m, { conn, command, usedPrefix, text, groupMetadata }) => {
const value = text ? text.trim() : ''
const chat = global.db.data.chats[m.chat]
if (command === 'setgp') {
return m.reply(`✦ Enter the category you want to modify in your group.\n\n🜸 Available categories:\n• ${usedPrefix}gpname <new name>\n> Change the group name\n• ${usedPrefix}gpdesc <new description>\n> Modify the group description\n• ${usedPrefix}gpimg <image>\n> Set a new image for the group (reply to an image)\n• ${usedPrefix}setwelcome <message>\n> Set the welcome message for new members\n• ${usedPrefix}setbye <message>\n> Sets the farewell message when a user leaves\n• ${usedPrefix}testwelcome\n> Simulate the welcome message\n• ${usedPrefix}testbye\n> Simulate the farewell message`)
}
try {
switch (command) {
case 'setwelcome': {
if (!value) return m.reply(`ꕥ You must send a message to set it as a welcome message.\n> You can use {user} to mention the user, {group} to mention the name of the group and {desc} to mention the group description.\n\n✐ Example: ${usedPrefix}setwelcome Welcome {user} to {group}!`)
chat.sWelcome = value
m.reply(`ꕥ You have set the welcome message correctly.\n> You can use ${usedPrefix}testwelcome to see what the welcome message will look like.`)
break
}
case 'setbye': {
if (!value) return m.reply(`ꕥ You must send a message to set it as a goodbye message.\n> You can use {user}, {group} and {desc} as dynamic variables.\n\n✐ Example: ${usedPrefix}setbye Bye {user}, we will miss you in {group}!`)
chat.sBye = value
m.reply(`ꕥ You have set the goodbye message correctly.\n> You can use ${usedPrefix}testbye to see what the farewell message will look like.`)
break
}
case 'testwelcome': {
if (!chat.sWelcome) return m.reply('⚠︎ No welcome message set.')
const { pp: ppWel, caption: captionWel, mentions: mentionsWel } = await generarBienvenida({ conn, userId: m.sender, groupMetadata, chat })
await conn.sendMessage(m.chat, { image: { url: ppWel }, caption: captionWel, mentions: mentionsWel }, { quoted: m })
try { fs.unlinkSync(ppWel) } catch {}
break
}
case 'testbye': {
if (!chat.sBye) return m.reply('⚠︎ No goodbye message set.')
const { pp: ppBye, caption: captionBye, mentions: mentionsBye } = await generarDespedida({ conn, userId: m.sender, groupMetadata, chat })
await conn.sendMessage(m.chat, { image: { url: ppBye }, caption: captionBye, mentions: mentionsWel }, { quoted: m })
try { fs.unlinkSync(ppBye) } catch {}
break
}}} catch (e) {
m.reply(`⚠︎ A problem has occurred.\n> The error details will be displayed below. Use ${usedPrefix}report to report it.\n\n${e.message}`)
}}

handler.help = ['setwelcome', 'setbye', 'testwelcome', 'testbye']
handler.tags = ['group']
handler.command = ['setgp', 'setwelcome', 'setbye', 'testwelcome', 'testbye']
handler.admin = true
handler.group = true

export default handler
