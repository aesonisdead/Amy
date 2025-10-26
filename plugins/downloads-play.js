// Creado por Speed3xz
// Rewritten by ChatGPT (yt-dlp local fixed version)
import yts from "yt-search"
import { exec } from "child_process"
import fs from "fs"
import path from "path"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

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

    const isAudio = ["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command)
    const fileExt = isAudio ? "mp3" : "mp4"
    const safeTitle = title.replace(/[\\\/:*?"<>|]/g, "")
    const filePath = path.join(TMP_DIR, `${safeTitle}.${fileExt}`)

    const format = isAudio ? "bestaudio[ext=m4a]" : "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4"

    const cmd = `yt-dlp -f "${format}" --no-playlist --output "${filePath}" "${url}"`

    await new Promise((resolve, reject) => {
      exec(cmd, (err) => {
        if (err) return reject(err)
        if (!fs.existsSync(filePath)) return reject(new Error("File not found after download"))
        resolve()
      })
    })

    // Send file properly
    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(filePath),
        fileName: `${safeTitle}.mp3`,
        mimetype: "audio/mpeg",
        ptt: false
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: fs.readFileSync(filePath),
        fileName: `${safeTitle}.mp4`,
        caption: `${title}`,
        mimetype: "video/mp4"
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

    // Delete file after sending
    setTimeout(() => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }, 60 * 1000)

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
