import { canLevelUp, xpRange } from '../lib/levelling.js'
import db from '../lib/database.js'

let handler = async (m, { conn }) => {
let mentionedJid = await m.mentionedJid
let who = mentionedJid[0] || (m.quoted ? await m.quoted.sender : m.sender)
let user = global.db.data.users[who]
let name = await (async () => user.name?.trim() || (await conn.getName(who).then(n => typeof n === 'string' && n.trim() ? n : who.split('@')[0]).catch(() => who.split('@')[0])))()
if (!user) {
await conn.sendMessage(m.chat, { text: "ꕥ No user data found." }, { quoted: m })
return
}
let { min, xp } = xpRange(user.level, global.multiplier)
let before = user.level * 1
while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++
if (before !== user.level) {
let txt = `ᥫ᭡ Congratulations you have leveled up.\n\n*${before}* ➔ *${user.level}*\n\n• ✰ *Previous level* : ${before}\n• ✧ *New level* : ${user.level}\n• ❖ *Date* : ${new Date().toLocaleString('id-ID')}\n\n> ➨ Note: *The more you interact with the Bot, the higher your level will be.*`
await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
} else {
let users = Object.entries(global.db.data.users).map(([key, value]) => {
return { ...value, jid: key }
})
let sortedLevel = users.sort((a, b) => (b.level || 0) - (a.level || 0))
let rank = sortedLevel.findIndex(u => u.jid === who) + 1
let txt = `*「✦」User* ◢ ${name} ◤\n\n✧ Level » *${user.level}*\n✰ Experience » *${user.exp}*\n➨ Progress » *${user.exp - min} => ${xp}* _(${Math.floor(((user.exp - min) / xp) * 100)}%)_\n# Rank » *${rank}* of *${sortedLevel.length}*\n❒ Total commands » *${user.commands || 0}*`
await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}}

handler.help = ['levelup']
handler.tags = ['rpg']
handler.command = ['lvl', 'level', 'levelup']
handler.group = true

export default handler
