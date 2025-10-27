import { execSync } from 'child_process'

var handler = async (m, { conn, text, isROwner }) => {
if (!isROwner) return
await m.react('🕒')
try {
const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
let messager = stdout.toString()
if (messager.includes('🎀 The update is now loaded.')) messager = '💗 The data is now updated to the latest version..'
if (messager.includes('🌷 Updating.')) messager = '🎀 Processing, please wait a moment while I update..\n\n' + stdout.toString()
await m.react('✔️')
conn.reply(m.chat, messager, m)
} catch { 
try {
const status = execSync('git status --porcelain')
if (status.length > 0) {
const conflictedFiles = status.toString().split('\n').filter(line => line.trim() !== '').map(line => {
if (line.includes('.npm/') || line.includes('.cache/') || line.includes('tmp/') || line.includes('database.json') || line.includes('sessions/Principal/') || line.includes('npm-debug.log')) {
return null
}
return '*→ ' + line.slice(3) + '*'}).filter(Boolean)
if (conflictedFiles.length > 0) {
const errorMessage = `\`⚠︎ The update could not be performed:\`\n\n> *Local changes have been found in the bot files that conflict with new repository updates..*\n\n${conflictedFiles.join('\n')}.`
await conn.reply(m.chat, errorMessage, m)
await m.react('✖️')
}}} catch (error) {
console.error(error)
let errorMessage2 = '⚠︎ An unexpected error occurred.'
if (error.message) {
errorMessage2 += '\n⚠︎ Error message: ' + error.message
}
await conn.reply(m.chat, errorMessage2, m)
}}}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'fix', 'actualizar']

export default handler
