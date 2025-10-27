let handler = async (m, { conn, usedPrefix, command, isROwner }) => {
if (!isROwner) return
try {
await m.react('🕒')
m.reply(`❀ Rebooting a ${botname} જ⁀➴\n> ► Wait until the *Socket* restarts.`)
await m.react('✔️')
setTimeout(() => {
if (process.send) {
process.send("restart")
} else {
process.exit(0)
}}, 3000)
} catch (error) {
await m.react('✖️')
console.log(error)
conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`, m)
}}

handler.help = ['restart']
handler.tags = ['owner']
handler.command = ['restart', 'reiniciar'] 

export default handler
