export async function before(m, { conn }) {
const primaryBot = global.db.data.chats[m.chat].primaryBot
if (primaryBot && conn.user.jid !== primaryBot) throw !1
const user = global.db.data.users[m.sender]
user.coin = user.coin || 0
user.exp = user.exp || 0
const formatTiempo = (ms) => {
if (typeof ms !== 'number' || isNaN(ms)) return 'unknowm'
const h = Math.floor(ms / 3600000)
const min = Math.floor((ms % 3600000) / 60000)
const s = Math.floor((ms % 60000) / 1000)
const parts = []
if (h) parts.push(`${h} ${h === 1 ? 'hour' : 'hours'}`)
if (min) parts.push(`${min} ${min === 1 ? 'minute' : 'minutes'}`)
if (s || (!h && !min)) parts.push(`${s} ${s === 1 ? 'second' : 'seconds'}`)
return parts.join(' ')
}
if (typeof user.afk === 'number' && user.afk > -1) {
const ms = Date.now() - user.afk
const horas = Math.floor(ms / 3600000)
const coins = horas * 200
const exps = horas * 30
user.coin += coins
user.exp += exps
const tiempo = formatTiempo(ms)
const recompensa = coins > 0? `\n○ Reward » *${coins} ${currency}*` : ''
await conn.reply(m.chat,`❀ ${await conn.getName(m.sender)} You stopped being inactive.\n○ Reason » *${user.afkReason || 'unspecified'}*\n○ inactive time » *${tiempo}* ${recompensa}`, m)
user.afk = -1
user.afkReason = ''
}
const quoted = m.quoted ? await m.quoted.sender : null
const jids = [...new Set([...(await m.mentionedJid || []), ...(quoted ? [quoted] : [])])]
for (const jid of jids) {
const target = global.db.data.users[jid]
if (!target || typeof target.afk !== 'number' || target.afk < 0) continue
const ms = Date.now() - target.afk
const tiempo = formatTiempo(ms)
await conn.reply(m.chat, `ꕥ The user ${await conn.getName(jid)} is AFK.\n○ Reason: ${target.afkReason || 'unspecified'}\n○ inactive time: ${tiempo}`, m)
}
return true
}
