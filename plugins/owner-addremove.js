import db from '../lib/database.js'
import MessageType from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, args, command, isROwner }) => {
if (!isROwner) return
try {
const now = Date.now()
const user = global.db.data.users
let mentionedJid = await m.mentionedJid
let who = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
switch (command) {
case 'addcoin': {
if (!who) return m.reply('❀ Please mention the user or quote a message.')
const coinTxt = text.replace(/^@\S+\s*/, '').trim().split(' ')[0]
if (!coinTxt) return m.reply(`ꕥ Please enter the amount you want to add.`)
if (isNaN(coinTxt)) return m.reply(`ꕥ Only numbers are allowed.`)
await m.react('🕒')
const dmt = parseInt(coinTxt)
const impts = 0
const pjkC = Math.ceil(dmt * impts)
if (dmt + pjkC < 1) return m.react('✖️'), m.reply(`ꕥ Minimum is *1*`)
user[who].coin += dmt
await m.react('✔️')
m.reply(`❀ *Added:*\n» ${dmt} \n@${who.split('@')[0]}, you received ${dmt} ${currency}`, null, { mentions: [who] })
break
}
case 'addxp': {
if (!who) return m.reply('❀ Please mention the user or quote a message.')
const xpTxt = text.replace(/^@\S+\s*/, '').trim().split(' ')[0]
if (!xpTxt) return m.reply(`ꕥ Enter the amount of experience (XP) you want to add.`)
if (isNaN(xpTxt)) return m.reply(`ꕥ Only numbers are allowed.`)
await m.react('🕒')
const xp = parseInt(xpTxt)
const pajak = 0
const pjkX = Math.ceil(xp * pajak)
if (xp + pjkX < 1) return m.react('✖️'), m.reply(`ꕥ El mínimo de experiencia (XP) es *1*`)
user[who].exp += xp
await m.react('✔️')
m.reply(`❀ XP Added: *${xp}* \n@${who.split('@')[0]}, you received ${xp} XP`, null, { mentions: [who] })
break
}
case 'addprem': {
if (!who) return m.reply('❀ Please mention the user or quote a message.')
if (!user[who]) user[who] = { premiumTime: 0, premium: false }
const premArgs = text.replace(/^@\S+\s*/, '').trim().split(' ').filter(arg => arg)
if (premArgs.length < 2) return m.reply('ꕥ Send a valid time\n> Example (1h, 2d, 3w, 4m).')
await m.react('🕒')
let tiempo = 0
const match = premArgs[0].match(/(\d+)([hdwm])/)
if (!match) return m.reply('ꕥ Invalid time.\nOptions:\n h = hours, d = days, w = weeks, m = months')
const cant = parseInt(match[1])
const unidad = match[2]
if (unidad === 'h') tiempo = 3600000 * cant
else if (unidad === 'd') tiempo = 86400000 * cant
else if (unidad === 'w') tiempo = 604800000 * cant
else if (unidad === 'm') tiempo = 2592000000 * cant
else return m.react('✖️'), m.reply('ꕥ Invalid time.\nOptions:\n h = hours, d = days, w = weeks, m = months')
user[who].premiumTime = now < user[who].premiumTime ? user[who].premiumTime + tiempo : now + tiempo
user[who].premium = true
const timeLeft = await formatTime(user[who].premiumTime - now)
await m.react('✔️')
m.reply(`✰ New Premium User!!!\n\nᰔᩚ User » @${who.split('@')[0]}\nⴵ Premium Time » ${cant}${unidad}\n✧ Time Remaining » ${timeLeft}`, null, { mentions: [who] })
break
}
case 'delprem': {
if (!who) return m.reply('❀ Please mention the user or quote a message.')  
if (!user[who]?.premiumTime) return m.react('✖️'), m.reply('ꕥ The user is not premium.')
await m.react('🕒')
user[who].premiumTime = 0
user[who].premium = false
await m.react('✔️')
m.reply(`❀ @${who.split('@')[0]} is no longer a premium user.`, null, { mentions: [who] })
break
}
case 'listprem': {
await m.react('🕒')
const perm = (global.prems || []).map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v !== conn.user.jid)
const listaPermanentes = perm.map(v => `│ User: @${v.replace(/@.+/, '')}`).join('\n')
const userList = Object.entries(user).filter(([_, v]) => v.premiumTime).map(([key, value]) => ({ ...value, jid: key }))
const sorted = userList.sort((a, b) => a.premiumTime - b.premiumTime)
const len = args[0] ? Math.min(100, Math.max(parseInt(args[0]), 10)) : Math.min(10, sorted.length)
const listaTemporales = await Promise.all(sorted.slice(0, len).map(async ({ jid, premiumTime }) => {
return `┌─⊷ \n│ User: @${jid.split('@')[0]}\n│ Expires in: ${premiumTime > 0 ? await formatTime(premiumTime - now) : 'Expired'}\n└───────────`
}))
const textList = `≡ PERMANENT PREMIUM\n\n❖ Total: ${perm.length}\n┌─⊷\n${listaPermanentes}\n└───────────\n\n≡ PREMIUM USERS\n❖ Total: ${sorted.length} \n${listaTemporales.join('\n')}`
const mentions = [...perm, ...sorted.slice(0, len).map(({ jid }) => jid)]
await m.react('✔️')
conn.reply(m.chat, textList, m, { mentions })
break
}}} catch (error) {
m.reply(`⚠︎ A problem has occurred.\n> Use ${command} report to inform it.\n\n${error.message}`)
}}

handler.help = ['addcoin', 'addxp', 'addprem', 'delprem', 'listprem']
handler.tags = ['owner']
handler.command = ['addcoin', 'addxp', 'addprem', 'delprem', 'listprem']

export default handler

async function formatTime(ms) {
let s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24)
let months = Math.floor(d / 30), weeks = Math.floor((d % 30) / 7)
s %= 60; m %= 60; h %= 24; d %= 7
let t = months ? [`${months} month${months > 1 ? 's' : ''}`] :
weeks ? [`${weeks} week${weeks > 1 ? 's' : ''}`] :
d ? [`${d} day${d > 1 ? 's' : ''}`] : []
if (h) t.push(`${h} hour${h > 1 ? 's' : ''}`)
if (m) t.push(`${m} minute${m > 1 ? 's' : ''}`)
if (s) t.push(`${s} second${s > 1 ? 's' : ''}`)
return t.length > 1 ? t.slice(0, -1).join(' ') + ' and ' + t.slice(-1) : t[0]
}
