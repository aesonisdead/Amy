import { makeWASocket } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, text, command, usedPrefix }) => {
try {
switch (command) {
case 'gpimg': case 'groupimg': {
const q = m.quoted || m
const mime = (q.msg || q).mimetype || ''
if (!/image\/(png|jpe?g)/.test(mime)) return m.reply('❀ You need an image to change the group profile.')
const img = await q.download()
if (!img) return m.reply('❀ You need an image for the group profile.')
await m.react('🕒')
await conn.updateProfilePicture(m.chat, img)
await m.react('✔️')
m.reply('❀ Group image changed successfully.')
break
}
case 'gpdesc': case 'groupdesc': {
if (!args.length) return m.reply('❀ Please enter the new description you want to set for the group..')
await m.react('🕒')
await conn.groupUpdateDescription(m.chat, args.join(' '))
await m.react('✔️')
m.reply('❀ Group description has been changed successfully.')
break
}
case 'gpname': case 'groupname': {
if (!text) return m.reply('❀ Please enter the new name you would like to give to the group.')
await m.react('🕒')
await conn.groupUpdateSubject(m.chat, text)
await m.react('✔️')
m.reply('❀ Group name changed successfully.')
break
}}} catch (e) {
await m.react('✖️')
m.reply(`⚠︎ A problem has occurred.\n> The error details will be displayed below. Use ${usedPrefix}report to inform it.\n\n${e.message}`)
}}

handler.help = ['gpimg', 'groupimg', 'gpdesc', 'groupdesc', 'gpname', 'groupname']
handler.tags = ['group']
handler.command = ['gpimg', 'groupimg', 'gpdesc', 'groupdesc', 'gpname', 'groupname']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
