import { readdirSync, unlinkSync, existsSync, promises as fs } from 'fs'
import path from 'path'
import cp from 'child_process'
import { promisify } from 'util'
import moment from 'moment-timezone'
import fetch from 'node-fetch'
const exec = promisify(cp.exec).bind(cp)
const linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

const handler = async (m, { conn, text, command, usedPrefix, args }) => {
try {
const nombre = m.pushName || 'Anonymous'
const tag = '@' + m.sender.split('@')[0]
const usertag = Array.from(new Set([...text.matchAll(/@(\d{5,})/g)]), m => `${m[1]}@s.whatsapp.net`)
const chatLabel = m.isGroup ? (await conn.getName(m.chat) || 'Group') : 'Private'
const horario = `${moment.tz('Africa/Casablanca').format('DD/MM/YYYY hh:mm:ss A')}`
switch (command) {
case 'suggest': case 'sug': {
if (!text) return conn.reply(m.chat, '❀ Write the suggestion you want to send to the Bot owner.', m)
if (text.length < 10) return conn.reply(m.chat, '🎀 The suggestion must be more than 10 characters long..', m)
await m.react('🕒')
const sug = `❀ 𝗦𝗨𝗚𝗚𝗘𝗦𝗧𝗜𝗢𝗡 𝗥𝗘𝗖𝗘𝗜𝗩𝗘𝗗\n\nꕥ *User* » ${nombre}\n✩ *Tag* » ${tag}\n✿ *Suggestion* » ${text}\n✦ *Chat* » ${chatLabel}\n✰ *Date* » ${horario}\n♤ *InfoBot* » ${botname} / ${vs}`
await conn.sendMessage(`${suittag}@s.whatsapp.net`, { text: sug, mentions: [m.sender, ...usertag] }, { quoted: m })
await m.react('✔️')
m.reply('❀ The suggestion has been sent to the developer. Thank you for helping improve our experience.')
break
}
case 'report': case 'rep': {
if (!text) return conn.reply(m.chat, '❀ Please enter the error you want to report..', m)
if (text.length < 10) return conn.reply(m.chat, '🎀 Please specify the error better, minimum 10 characters.', m)
await m.react('🕒')
const rep = `❀ 𝗥𝗘𝗣𝗢𝗥𝗧 𝗥𝗘𝗖𝗘𝗜𝗩𝗘𝗗\n\nꕥ *User* » ${nombre}\n✩ *Tag* » ${tag}\n✿ *Report* » ${text}\n✦ *Chat* » ${chatLabel}\n✰ *Date* » ${horario}\n♤ *InfoBot* » ${botname} / ${vs}`
await conn.sendMessage(`${suittag}@s.whatsapp.net`, { text: rep, mentions: [m.sender, ...usertag] }, { quoted: m })
await m.react('✔️')
m.reply('❀ The report has been sent to the developer. Please note that any false reports may result in restrictions on the bot usage.')
break
}
case 'invite': case 'inv': {
if (!text) return m.reply(`❀ You must send a link to invite the Bot to your group.`)
let [_, code] = text.match(linkRegex) || []
if (!code) return m.reply('🎀 The invitation link is not valid.')
await m.react('🕒')
const invite = `❀ 𝗜𝗡𝗩𝗜𝗧𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 𝗔 𝗚𝗥𝗢𝗨𝗣\n\nꕥ *User* » ${nombre}\n✩ *Tag* » ${tag}\n✿ *Chat* » ${chatLabel}\n✰ *Date* » ${horario}\n♤ *InfoBot* » ${botname} / ${vs}\n✦ *Link* » ${text}`
const mainBotNumber = global.conn.user.jid.split('@')[0]
const senderBotNumber = conn.user.jid.split('@')[0]
if (mainBotNumber === senderBotNumber)
await conn.sendMessage(`${suittag}@s.whatsapp.net`, { text: invite, mentions: [m.sender, ...usertag] }, { quoted: m })
else
await conn.sendMessage(`${senderBotNumber}@s.whatsapp.net`, { text: invite, mentions: [m.sender, ...usertag] }, { quoted: m })
await m.react('✔️')
m.reply('❀ The link was sent successfully. Thank you for your invitation! ฅ^•ﻌ•^ฅ')
break
}
case 'speedtest': case 'stest': {
await m.react('🕒')
const o = await exec('python3 ./lib/ookla-speedtest.py --secure --share')
const { stdout, stderr } = o
if (stdout.trim()) {
const url = stdout.match(/http[^"]+\.png/)?.[0]
if (url) await conn.sendMessage(m.chat, { image: { url }, caption: stdout.trim() }, { quoted: m })
}
if (stderr.trim()) {
const url2 = stderr.match(/http[^"]+\.png/)?.[0]
if (url2) await conn.sendMessage(m.chat, { image: { url: url2 }, caption: stderr.trim() }, { quoted: m })
}
await m.react('✔️')
break
}
case 'fixmsg': case 'ds': {
if (global.conn.user.jid !== conn.user.jid)
return conn.reply(m.chat, '❀ Use this command on the main Bot number.', m)
await m.react('🕒')
const chatIdList = m.isGroup ? [m.chat, m.sender] : [m.sender]
const sessionPath = './Sessions/'
let files = await fs.readdir(sessionPath)
let count = 0
for (let file of files) {
for (let id of chatIdList) {
if (file.includes(id.split('@')[0])) {
await fs.unlink(path.join(sessionPath, file))
count++
break
}}}
await m.react(count === 0 ? '✖️' : '✔️')
conn.reply(m.chat, count === 0 ? '🎀 No files related to your ID were found..' : `🎀 Eliminated ${count} of session files.`, m)
break
}
case 'script': case 'sc': {
await m.react('🕒')
const res = await fetch('https://api.github.com/repos/aethonxei/Jas-X')
if (!res.ok) throw new Error('Could not get data from repository.')
const json = await res.json()
const txt = `*乂  S C R I P T  -  M A I N  乂*\n\n✩ *Name* : ${json.name}\n✩ *Visits* : ${json.watchers_count}\n✩ *Size* : ${(json.size / 1024).toFixed(2)} MB\n✩ *Updated* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n✩ *Url* : ${json.html_url}\n✩ *Forks* : ${json.forks_count}\n✩ *Stars* : ${json.stargazers_count}\n\n> *${dev}*`
await conn.sendMessage(m.chat, { image: catalogo, caption: txt, ...rcanal }, { quoted: m })
await m.react('✔️')
break
}}} catch (err) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${err.message}`, m)
}}

handler.help = ['suggest', 'report', 'invite', 'speedtest', 'fixmsg', 'script']
handler.tags = ['main']
handler.command = ['suggest', 'sug', 'report', 'rep', 'invite', 'inv', 'speedtest', 'stest', 'fixmsg', 'ds', 'sc', 'script']

export default handler
