// Creado por Speed3xz
// API reemplazada por yt-dlp local
import { exec } from "child_process"
import yts from "yt-search"
import fs from "fs"
import path from "path"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const TEMP_DIR = "/tmp" // puedes cambiar a otra carpeta en tu phone si quieres

async function downloadYT(url, format = "audio") {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(TEMP_DIR, `yt_${Date.now()}.%(ext)s`)
    let cmd = `yt-dlp -o "${outputPath}"`

    if (format === "audio") cmd += " -x --audio-format mp3"
    else if (format === "video") cmd += " -f mp4"

    cmd += ` "${url}"`

    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error)

      // buscar archivo descargado
      const files = fs.readdirSync(TEMP_DIR).filter(f => f.includes("yt_"))
      if (!files.length) return reject(new Error("No se encontró archivo descargado"))
      resolve(path.join(TEMP_DIR, files[files.length - 1]))
    })
  })
}

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `✧ 𝙃𝙚𝙮! Debes escribir *el nombre o link* del video/audio para descargar.`, m)
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key }})

    let videoIdToFind = text.match(youtubeRegexID)
    let searchResults = await yts(videoIdToFind ? "https://youtu.be/" + videoIdToFind[1] : text)
    
    let ytplay2 = searchResults.videos?.[0] || searchResults.all?.[0]
    if (!ytplay2) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
      return m.reply("⚠︎ No encontré resultados, intenta con otro nombre o link.")
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    const vistas = formatViews(views)
    const canal = author?.name || "Desconocido"

    const infoMessage = `
╭──❀ Detalles del contenido ❀──╮
🎀 Título » *${title}*  
🌸 Canal » *${canal}*  
🍃 Vistas » *${vistas}*  
⏳ Duración » *${timestamp}*  
🗓️ Publicado » *${ago}*  
🔗 Link » *${url}*  
╰──────────────────────╯

> 𐙚🌷 ｡･ﾟ✧ Preparando tu descarga... ˙𐙚🌸
    `.trim()

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage
    }, { quoted: m })

    if (["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command)) {
      try {
        const filePath = await downloadYT(url, "audio")
        await conn.sendMessage(m.chat, {
          audio: { url: "file://" + filePath },
          fileName: `${title}.mp3`,
          mimetype: "audio/mpeg",
          ptt: false
        }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, "✦ Error al descargar el audio. Intenta más tarde.", m)
      }
    }
    else if (["play2", "ytmp4", "ytv", "mp4"].includes(command)) {
      try {
        const filePath = await downloadYT(url, "video")
        await conn.sendMessage(m.chat, {
          video: { url: "file://" + filePath },
          fileName: `${title}.mp4`,
          caption: `${title}`,
          mimetype: "video/mp4"
        }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, "✦ Error al descargar el video. Intenta más tarde.", m)
      }
    }

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
    return m.reply(`⚠︎ Error inesperado:\n\n${error.message}`)
  }
}

handler.command = handler.help = ["play", "ytaudio", "yta", "ytmp3", "mp3", "play2", "ytmp4", "ytv", "mp4"]
handler.tags = ["descargas"]

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
}
