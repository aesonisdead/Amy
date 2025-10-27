import fetch from 'node-fetch'
import Jimp from 'jimp'

const handler = async (m, { conn, command, usedPrefix, text }) => {
const isSubBots = [conn.user.jid, ...global.owner.map(number => `${number}@s.whatsapp.net`)].includes(m.sender)
if (!isSubBots) return m.reply(`❀ The command *${command}* can only be executed by the owner.`)
try {
const value = text ? text.trim() : ''
switch (command) {
case 'setpfp': case 'setimage': {
const q = m.quoted || m
const mime = (q.msg || q).mimetype || ''
if (!/image\/(png|jpe?g)/.test(mime)) return conn.reply(m.chat, `❀ Please reply or submit a valid image to change the profile picture..`, m)
const media = await q.download()
if (!media) return conn.reply(m.chat, `ꕥ The image could not be obtained.`, m)
const image = await Jimp.read(media)
const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
await conn.updateProfilePicture(conn.user.jid, buffer)
conn.reply(m.chat, `❀ Bot's *profile picture* has been changed successfully.`, m)
break
}
case 'setstatus': case 'setbio': {
if (!text) return conn.reply(m.chat, `❀ Please enter the new bio you want to put on me.`, m)
await conn.updateProfileStatus(text)
conn.reply(m.chat, `❀ Bot's bio was changed to *"${text}"* successfully.`, m)
break
}
case 'setname': case 'setuser': {
if (!value) return conn.reply(m.chat, '❀ Enter the new name you want to set.', m)
if (value.length < 3 || value.length > 25)
return conn.reply(m.chat, 'ꕥ The name must be between 3 and 25 characters..')
await conn.updateProfileName(value)
m.reply(`❀ Bot name have been changed to *${value}* successfully.`)
break
}}} catch (error) {
m.reply(`⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`)
}}

handler.help = ['setpfp', 'setimage', 'setstatus', 'setbio', 'setname', 'setuser']
handler.tags = ['socket']
handler.command = ['setpfp', 'setimage', 'setstatus', 'setbio', 'setname', 'setuser']

export default handler
