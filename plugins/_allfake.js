import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) { 
global.canalIdM = ["120363420610572685@newsletter"]
global.canalNombreM = ["【 ✰ 】𝗝𝗮𝘀-𝗫 ~ 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁"]
global.channelRD = await getRandomChannel()

global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('en-US', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('en-US', {month: 'long'})
global.año = d.toLocaleDateString('en-US', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

var canal = 'https://whatsapp.com/channel/0029VbBQ1kG8PgsPtLAabC23'  
var comunidad = 'https://chat.whatsapp.com/GQnLhRAfMD8KS3vtVZSonp?mode=wwt'
var git = 'https://github.com/aethonxei/'
var github = 'https://github.com/aethonxei/Jas-X' 
var correo = ''
global.redes = [canal, comunidad, git, github, correo].getRandom()

global.nombre = m.pushName || 'Jas-User'
global.packsticker = `┊ Jas-X Creator\n⤷ aethonxei\n\n┊Supoort 💗\n ⤷ join our support gc/ch`;
global.packsticker2 = `┊Bot 🎀\n┊⤷${botname} \n\n┊User:\n┊⤷${nombre}`
  
global.fkontak = { key: { participants:"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
global.rcanal = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, serverMessageId: '', newsletterName: channelRD.name }, externalAdReply: { title: botname, body: dev, mediaUrl: null, description: null, previewType: "PHOTO", thumbnail: await (await fetch(icono)).buffer(), sourceUrl: redes, mediaType: 1, renderLargerThumbnail: false }, mentionedJid: null }}
}

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}
