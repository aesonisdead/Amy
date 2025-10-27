import fs from 'fs'
import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'
import { unlinkSync, existsSync } from 'fs'

const exec = promisify(_exec).bind(cp)
const handler = async (m, { conn, text, command, usedPrefix, isROwner }) => {
if (!isROwner) return
try {
const ar = Object.keys(plugins)
const ar1 = ar.map(v => v.replace('.js', ''))
switch (command) {
case 'saveplugin': {
if (!text) return m.reply(`❀ Please enter the name of the plugin.`)
if (!m.quoted || !m.quoted.text) return m.reply(`✧ Reply to the message with the plugin content.`)
await m.react('🕒')
const ruta = `plugins/${text}.js`
await fs.writeFileSync(ruta, m.quoted.text)
await m.react('✔️')
m.reply(`❀ Saving plugin in ${ruta}`)
break
}
case 'savefile': {
if (!text) return m.reply(`❀ Enter the Path and File name next to the command.`)
if (!m.quoted?.text) return m.reply(`ꕥ Reply to the message.`)
await m.react('🕒')
const path = `${text}.js`
await fs.writeFileSync(path, m.quoted.text)
await m.react('✔️')
m.reply(`❀ Saved in *${path}*.`)
break
}
case 'deletefile': {
if (!text) return conn.reply(m.chat, `❀ Enter the path and name of the file you want to delete.`, m)
const file = text.trim()
if (!existsSync(file)) return conn.reply(m.chat, `ꕥ File not found.`, m)
await m.react('🕒')
unlinkSync(file)
await m.react('✔️')
conn.reply(m.chat, `❀ The file *${file}* has been successfully removed.`, m)
break
}
case 'getplugin': {
if (!text) return conn.reply(m.chat,`❀ Enter the name of an existing plugin*\n\n*—◉ Example*\n*◉ ${usedPrefix + command}* info-infobot\n\n*—◉ List of plugins:*\n*◉* ${ar1.map(v => ' ' + v).join`\n*◉*`}`, m)
if (!ar1.includes(text)) return conn.reply(m.chat, `ꕥ Plugin not found "${text}".\n\n*—◉ Existing plugins:*\n*◉* ${ar1.map(v => ' ' + v).join`\n*◉*`}`, m)
await m.react('🕒')
const filePath = `./plugins/${text}.js`
await conn.sendMessage(m.chat, { document: fs.readFileSync(filePath), mimetype: 'application/javascript', fileName: `${text}.js` }, { quoted: m })
await m.react('✔️')
break
}}} catch (e) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use ${usedPrefix}report to inform it.\n\n${e.message}`, m)
}}

handler.help = ['saveplugin', 'savefile', 'deletefile', 'getplugin']
handler.tags = ['owner']
handler.command = ['saveplugin', 'savefile', 'deletefile', 'getplugin']

export default handler
