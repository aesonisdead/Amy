const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
const pesan = args.join` `
const oi = `*» INFO :* ${pesan}`
let teks = `*!  GENERAL MENTION  !*\n  *FOR ${participants.length} MEMBERS* 🗣️\n\n ${oi}\n\n╭  ┄ 𝅄 ۪꒰ \`⡞᪲=͟͟͞${botname}≼᳞ׄ\` ꒱ ۟ 𝅄 ┄\n`
for (const mem of participants) {
teks += `┊ꕥ @${mem.id.split('@')[0]}\n`
}
teks += `╰⸼ ┄ ┄ ┄ ─  ꒰  ׅ୭ *${vs}* ୧ ׅ ꒱  ┄  ─ ┄⸼`
conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) })
}

handler.help = ['all']
handler.tags = ['group']
handler.command = ['all', 'tagall']
handler.admin = true
handler.group = true

export default handler
