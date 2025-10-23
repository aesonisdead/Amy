let handler = async (m, { conn, usedPrefix, command}) => {
await conn.reply(m.chat,`Our Father, who art in heaven, hallowed be thy name, thy kingdom come, thy will be done on earth as it is in heaven. And forgive us our debts as we forgive our.`, estilo)
}
handler.customPrefix = /^(Fototeta|fototeta)$/i
handler.command = new RegExp
export default handler
