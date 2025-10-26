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

// Helper to execute yt-dlp with fallback
async function ytDlpDownload(url, outputPath, format) {
  const cmdHighQuality = format === "audio" 
    ? `yt-dlp -f bestaudio --extract-audio --audio-format mp3 --no-playlist --output "${outputPath}" "${url}"`
    : `yt-dlp -f bestvideo+bestaudio/best --merge-output-format mp4 --no-playlist --output "${outputPath}" "${url}"`

  const cmdFallback = format === "audio"
    ? `yt-dlp -f anyaudio --extract-audio --audio-format mp3 --no-playlist --output "${outputPath}" "${url}"`
    : `yt-dlp -f best[ext=mp4]/best --merge-output-format mp4 --no-playlist --output "${outputPath}" "${url}"`

  // Try high quality first
  try {
    await new Promise((resolve, reject) => {
      exec(cmdHighQuality, (error, stdout, stderr) => {
        if (error) return reject(error)
        resolve(stdout)
      })
    })
  } catch {
    // If failed, fallback
    await new Promise((resolve, reject) => {
      exec(cmdFallback, (error, stdout, stderr) => {
        if (error) return reject(error)
        resolve(stdout)
      })
    })
  }
}

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
    const safeTitle = sanitizeFilename(title)

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

    // Audio download
    if (["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command)) {
      try {
        const outputPath = path.join(TMP_DIR, `${safeTitle}.mp3`)
        await ytDlpDownload(url, outputPath, "audio")

        await conn.sendMessage(m.chat, {
          audio: { url: outputPath },
          fileName: `${safeTitle}.mp3`,
          mimetype: "audio/mpeg",
          ptt: false
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, `✦ Error downloading audio. Please try again later.\n\n${error.message}`, m)
      }
    }

    // Video download
    else if (["play2", "ytmp4", "ytv", "mp4"].includes(command)) {
      try {
        const outputPath = path.join(TMP_DIR, `${safeTitle}.mp4`)
        await ytDlpDownload(url, outputPath, "video")

        await conn.sendMessage(m.chat, {
          video: { url: outputPath },
          fileName: `${safeTitle}.mp4`,
          caption: `${title}`,
          mimetype: "video/mp4"
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, `⚠︎ Error downloading video. Please try again later.\n\n${error.message}`, m)
      }
    }

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
    return m.reply(`⚠︎ Unexpected error:\n\n${error.message}`)
  }
}

handler.command = handler.help = ["play", "ytaudio", "yta", "ytmp3", "mp3", "play2", "ytmp4", "ytv", "mp4"]
handler.tags = ["media"]

export default handler

function formatViews(views) {
  if (!views) return "unavailable"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
}
