import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command, text }) => {
if (!text) return conn.reply(m.chat, `❀ Please enter the name of any anime.`, m)
try {
await m.react('🕒')
let res = await fetch('https://api.jikan.moe/v4/manga?q=' + text)
if (!res.ok) {
await m.react('✖️')
return conn.reply(m.chat, `⚠︎ An error occurred.`, m)
}
let json = await res.json()
let { chapters, title_japanese, url, type, score, members, background, status, volumes, synopsis, favorites } = json.data[0]
let author = json.data[0].authors[0].name
let animeingfo = `❀ Title: ${title_japanese}
» Chapter: ${chapters}
» Type: ${type}
» Status: ${status}
» Volumes: ${volumes}
» Favorites: ${favorites}
» Score: ${score}
» Members: ${members}
» Autor: ${author}
» Background: ${background}
» Synopsis: ${synopsis}
» Url: ${url}` 
await conn.sendFile(m.chat, json.data[0].images.jpg.image_url, 'anjime.jpg', '✧ *I N F O - A N I M E* ✧\n\n' + animeingfo, fkontak)
await m.react('✔️')
} catch (error) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`, m)
}}

handler.help = ['infoanime'] 
handler.tags = ['anime']
handler.command = ['infoanime']
handler.group = true

export default handler
