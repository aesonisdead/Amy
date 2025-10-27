import { promises as fs } from 'fs'

const handler = async (m, {conn, participants, groupMetadata}) => {
const chat = global.db.data.chats[m.chat]
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://files.catbox.moe/mq2yh8.jpg')
const { antiLink, detect, welcome, sWelcome, sBye, modoadmin, nsfw, isBanned, economy, gacha, primaryBot } = global.db.data.chats[m.chat]
const groupAdmins = participants.filter(p => p.admin)
const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
const creador = (!owner || owner.startsWith('1203') || owner.length < 15) ? 'Not found' : `@${owner.split('@')[0]}`
const rawPrimary = typeof chat.primaryBot === 'string' ? chat.primaryBot : '';
const botprimary = rawPrimary.endsWith('@s.whatsapp.net') ? `@${rawPrimary.split('@')[0]}` : 'Random';  
const totalreg = Object.keys(global.db.data.users).length

const text = `「✦」Group ◢ ${groupMetadata.subject} ◤

❀ *Creator* » ${creador}
✦ *Members* » ${participants.length} Participants
ꕥ *Admins* » ${groupAdmins.length}
☆ *Registered* » ${totalreg.toLocaleString()}
❖ *Main bot* » ${botprimary}

*▢ Options:*
> ◆ *${botname}* » ${isBanned ? '✗ Disabled' : '✓ Activated'}
> ◆ *Welcome* » ${welcome ? '✓ Activated' : '✗ Disabled'}
> ◆ *Alerts* » ${detect ? '✓ Activated' : '✗ Disabled'}
> ◆ *Anti-Link* » ${antiLink ? '✓ Activated' : '✗ Disabled'}
> ◆ *Only-Admin* » ${modoadmin ? '✓ Activated' : '✗ Disabled'}
> ◆ *NSFW* » ${nsfw ? '✓ Activated' : '✗ Disabled'}
> ◆ *Gacha* » ${gacha ? '✓ Activated' : '✗ Disabled'}
> ◆ *Economy* » ${economy ? '✓ Activated' : '✗ Disabled'}

*▢ Messages:*
> ● *Welcome* » ${(sWelcome || 'No welcome message').replace(/{user}/g, `@${m.sender.split('@')[0]}`).replace(/{group}/g, `*${groupMetadata.subject}*`).replace(/{desc}/g, `*${groupMetadata.desc || 'No description'}*`)}
> ● *Bye* » ${(sBye || 'No farewell message').replace(/{user}/g, `@${m.sender.split('@')[0]}`).replace(/{group}/g, `*${groupMetadata.subject}*`).replace(/{desc}/g, `*${groupMetadata.desc || 'No description'}*`)}`
conn.sendFile(m.chat, pp, 'img.jpg', text, m, false, { mentions: [owner, rawPrimary, m.sender] })
}

handler.help = ['groupinfo']
handler.tags = ['group']
handler.command = ['groupinfo', 'gpinfo', 'gp', 'group']
handler.group = true

export default handler
