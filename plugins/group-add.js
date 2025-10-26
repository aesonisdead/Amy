import moment from 'moment-timezone'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `❀ Please enter the number you want to send a group invitation to..`, m)
if (text.includes('+')) return conn.reply(m.chat, `ꕥ Enter the number all together without the *+*`, m)
if (isNaN(text)) return conn.reply(m.chat, `ꕥ Enter only numbers without your country code and without spaces.`, m)
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
let tag = m.sender ? '@' + m.sender.split('@')[0] : 'User'
const chatLabel = m.isGroup ? (await conn.getName(m.chat) || 'Group') : 'Private'
const horario = `${moment.tz('Africa/Casablanca').format('DD/MM/YYYY hh:mm:ss A')}`
const invite = `❀ 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗩𝗜𝗧𝗔𝗧𝗜𝗢𝗡\n\nꕥ *User* » ${tag}\n✿ *Chat* » ${chatLabel}\n✰ *Date* » ${horario}\n✦ *Link* » ${link}`
await conn.reply(`${text}@s.whatsapp.net`, invite, m, { mentions: [m.sender] })
m.reply(`❀ The invitation link was sent to the user successfully..`)
}

handler.help = ['invite']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir']
handler.group = true
handler.botAdmin = true

export default handler
