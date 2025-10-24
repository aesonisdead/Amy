import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
try {
if (!text) return conn.reply(m.chat, `❀ Please enter the name of the Pokemon you want to search for.`, m)
const url = `https://some-random-api.com/pokemon/pokedex?pokemon=${encodeURIComponent(text)}`
await m.react('🕒')
const response = await fetch(url)
const json = await response.json()
if (!response.ok) return conn.reply(m.chat, '⚠︎ An error occurred.', m)
const aipokedex = `❀ *Pokedex - Information*\n\n> • *Name* » ${json.name}\n> • *ID* » ${json.id}\n> • *Type* » ${json.type}\n> • *Abilities* » ${json.abilities}\n> • *Height* » ${json.height}\n> • *Weight* » ${json.weight}\n> • *Description* » ${json.description}\n\n> ¡Find more details about this Pokémon in the Pokedex!\n\n> https://www.pokemon.com/es/pokedex/${json.name.toLowerCase()}`
conn.reply(m.chat, aipokedex, m)
await m.react('✔️')
} catch (error) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`, m)
}}

handler.help = ['pokedex']
handler.tags = ['fun']
handler.command = ['pokedex']
handler.group = true

export default handler
