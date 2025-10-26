import { cpus as _cpus, totalmem, freemem, platform, hostname } from 'os'
import { execSync } from 'child_process'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })
let handler = async (m, { conn }) => {
let totalUsers = Object.keys(global.db.data.users).length
let totalChats = Object.keys(global.db.data.chats).length
let totalPlugins = Object.values(global.plugins).filter((v) => v.help && v.tags).length
let totalBots = global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== 3).length
let totalCommands = Object.values(global.db.data.users).reduce((acc, user) => acc + (user.commands || 0), 0)
let system = `*「✦」System Status*\n\n◇ *Commands executed* » ${toNum(totalCommands)}\n◇ *Registered users* » ${totalUsers.toLocaleString()}\n◇ *Registered groups* » ${totalChats.toLocaleString()}\n◇ *Plugins* » ${totalPlugins}\n◇ *Active Bots* » ${totalBots}\n\n❍ *Server Status*\n\n◆ *System* » ${platform()}\n◆ *CPU* » ${_cpus().length} cores\n◆ *RAM* » ${format(totalmem())}\n◆ *RAM Used* » ${format(totalmem() - freemem())}\n◆ *Architecture* » ${process.arch}\n◆ *Host ID* » ${hostname().slice(0, 8)}...\n\n*❑ NODEJS Memory Usage*\n\n◈ *Ram Used* » ${format(process.memoryUsage().rss)}\n◈ *Reserved Heap* » ${format(process.memoryUsage().heapTotal)}\n◈ *Used Heap* » ${format(process.memoryUsage().heapUsed)}\n◈ *Native Modules* » ${format(process.memoryUsage().external)}\n◈ *Data Buffers* » ${format(process.memoryUsage().arrayBuffers)}`
await conn.reply(m.chat, system, m, rcanal)
}

handler.help = ['system']
handler.tags = ['info']
handler.command = ['system', 'status']

export default handler

function toNum(number) {
if (number >= 1000 && number < 1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number >= 1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else {
return number.toString()
}}
