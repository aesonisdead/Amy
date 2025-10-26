// Creado por Speed3xz
import yts from "yt-search"
import { exec } from "child_process"
import fs from "fs"
import path from "path"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

// Ensure tmp folder exists
const TMP_DIR = path.join(process.cwd(), "tmp")
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })

// Aggressive filename sanitization
function sanitizeFilename(name) {
  return name.replace(/[\/\\?%*:|"<>()]/g, '').trim()
}

// Replace spaces with underscores for safer Termux handling
function safeFilenameForYT(name) {
  return sanitizeFilename(name).replace(/ /g, "_")
}

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `✧ 𝙃𝙚𝙮! You must write *the name or link* of the video/audio to download.`, m)
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key }})

    let videoIdToFind = text.match(youtubeRegexID)
    let searchResults = await yts(videoIdToFind ? "https://youtu.be/" + videoIdToFind[1] : text)
    
    let ytVideo = searchResults.videos?.[0] || searchResults.all?.[0]
    if (!ytVideo) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
      return m.reply("⚠︎ I didn't find any results, try another name or link.")
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytVideo
    const vistas = formatViews(views)
    const canal = author?.name || "Unknown"
    const safeTitle = safeFilenameForYT(title)

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

    // Audio download (/play)
    if (["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command)) {
      const outputPath = path.join(TMP_DIR, `${safeTitle}.mp3`)
      const cmdHQ = `yt-dlp -f "bestaudio" --extract-audio --audio-format mp3 --no-playlist --output "${outputPath}" "${url}"`
      const cmdFallback = `yt-dlp --extract-audio --audio-format mp3 --no-playlist --output "${outputPath}" "${url}"`

      try {
        await runYTDLP(cmdHQ)
        if (!fs.existsSync(outputPath)) throw new Error("High-quality audio not available")
      } catch {
        await runYTDLP(cmdFallback)
        if (!fs.existsSync(outputPath)) throw new Error("Audio download failed")
      }

      await conn.sendMessage(m.chat, {
        audio: { url: outputPath },
        fileName: `${safeTitle}.mp3`,
        mimetype: "audio/mpeg",
        ptt: false
      }, { quoted: m })

      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
    }

    // Video download (/play2)
    else if (["play2", "ytmp4", "ytv", "mp4"].includes(command)) {
      const outputPath = path.join(TMP_DIR, `${safeTitle}.mp4`)
      const cmd = `yt-dlp --no-playlist --merge-output-format mp4 --output "${outputPath}" "${url}"`
      await runYTDLP(cmd)

      await conn.sendMessage(m.chat, {
        video: { url: outputPath },
        fileName: `${safeTitle}.mp4`,
        caption: title,
        mimetype: "video/mp4"
      }, { quoted: m })

      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
    }

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
    return m.reply(`⚠︎ Unexpected error:\n\n${error.message}`)
  }
}

handler.command = handler.help = ["play", "ytaudio", "yta", "ytmp3", "mp3", "play2", "ytmp4", "ytv", "mp4"]
handler.tags = ["media"]

export default handler

// Helper to run yt-dlp command
function runYTDLP(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error)
      resolve(stdout)
    })
  })
}

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
}
