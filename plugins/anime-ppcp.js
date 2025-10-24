import fetch from "node-fetch"

let handler = async (m, { conn }) => {
try {
await m.react('🕒')
let data = await (await fetch('https://raw.githubusercontent.com/ShirokamiRyzen/WAbot-DB/main/fitur_db/ppcp.json')).json()
let cita = data[Math.floor(Math.random() * data.length)]
let cowi = await (await fetch(cita.cowo)).buffer()
await conn.sendFile(m.chat, cowi, '', '*Male* ♂', m)
let ciwi = await (await fetch(cita.cewe)).buffer()
await conn.sendFile(m.chat, ciwi, '', '*Female* ♀', m)
await m.react('✔️')
} catch (error) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`, m)
}}

handler.help = ['ppcouple']
handler.tags = ['anime']
handler.command = ['ppcp', 'ppcouple']
handler.group = true

export default handler
