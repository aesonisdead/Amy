// Creado por Speed3xz
// Rewritten by ChatGPT (yt-dlp local version)
import yts from "yt-search"
import { exec } from "child_process"
import fs from "fs"
import path from "path"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

// Path for temporary downloads
const TMP_DIR = "./tmp"
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR)

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `✧ 𝙃𝙚𝙮! You must write *the name or link* of the video/audio to download.`, m)
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key }})

    let videoIdToFind = text.match(youtubeRegexID)
    let searchResults = await yts(videoIdToFind ? "https://youtu.be/" + videoIdToFind[1] : text)
    let ytplay2 = searchResults.videos?.[0] || searchResults.all?.[0]

    if (!ytplay2) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
      return m.reply("⚠︎ I didn't find any results, try another name or link.")
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    const vistas = formatViews(views)
    const canal = author?.name || "Unknown"

    const infoMessage = `
╭──❀ Content details ❀──╮
🎀 Title » *${title}*  
🌸 Channel » *${canal}*  
🍃 Views » *${vistas}*  
⏳ Duration » *${timestamp}*  
🗓️ Published » *${ago}*  
🔗 Link » *${url}*  
╰──────────────────────╯

> 𐙚🌷 ｡･ﾟ✧ Preparing your download... ˙𐙚🌸
    `.trim()

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage
    }, { quoted: m })

    const fileName = `${title.replace(/[\\\/:*?"<>|]/g, "")}.${["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command) ? "mp3" : "mp4"}`
    const outputPath = path.join(TMP_DIR, fileName)

    const isAudio = ["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command)
    const format = isAudio ? "bestaudio" : "bestvideo+bestaudio"

    const cmd = `yt-dlp -f "${format}" --no-playlist --quiet --progress --output "${outputPath}" "${url}"`

    await new Promise((resolve, reject) => {
      exec(cmd, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })

    // Send the file
    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: outputPath },
        fileName,
        mimetype: "audio/mpeg",
        ptt: false
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: outputPath },
        fileName,
        caption: `${title}`,
        mimetype: "video/mp4"
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

    // Clean up temporary file
    setTimeout(() => fs.existsSync(outputPath) && fs.unlinkSync(outputPath), 60000)

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
    return m.reply(`⚠︎ Unexpected error:\n\n${error.message}`)
  }
}

handler.command = handler.help = [
  "play", "ytaudio", "yta", "ytmp3", "mp3",
  "play2", "ytmp4", "ytv", "mp4"
]
handler.tags = ["media"]

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
}
