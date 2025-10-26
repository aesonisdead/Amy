var handler = async (m, { conn, args }) => {
let group = m.chat
const pp = await conn.profilePictureUrl(group, 'image').catch((_) => 'https://files.catbox.moe/mq2yh8.jpg')
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
let message = `\t*⌁☍꒷₊˚ Group Link ꒷₊˚⌁☍*\n\n> \`Link:\` ${link}`
await conn.sendMessage(group, { image: { url: pp }, caption: message })
}

handler.help = ['link']
handler.tags = ['group']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler
