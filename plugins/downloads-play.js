// Creado por Speed3xz
// Api by russellxz
import fetch from "node-fetch"
import yts from "yt-search"
import { exec } from "child_process"
import util from "util"
const execPromise = util.promisify(exec)

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const API_BASE = "https://api-sky.ultraplus.click"
const API_KEY = "Russellxz"

async function skyYT(url, format) {
  const response = await fetch(`${API_BASE}/api/download/yt.php?url=${encodeURIComponent(url)}&format=${format}`, {
    headers: { 
      Authorization: `Bearer ${API_KEY}`
    },
    timeout: 30000
  })
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  
  const data = await response.json()
  if (!data || data.status !== "true" || !data.data) throw new Error(data?.error || "Error en la API")
  
  return data.data
}

function sanitizeFilename(name) {
  return name.replace(/[\/\\?%*:|"<>]/g, '').trim()
}

async function getDirectURL(url, type = 'video') {
  // type: 'video' or 'audio'
  let format = type === 'audio' 
    ? 'bestaudio[ext=m4a]/bestaudio' 
    : 'best[ext=mp4]/bestvideo+bestaudio'
  
  const cmd = `yt-dlp -f "${format}" --no-playlist --print-json "${url}"`
  const { stdout } = await execPromise(cmd)
  const info = JSON.parse(stdout)
  return type === 'audio' ? info.url : info.url
}

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) return conn.reply(m.chat, `✧ 𝙃𝙚𝙮! You must write *the name or link* of the video/audio to download.`, m)
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

    if (["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command)) {
      try {
        const directURL = await getDirectURL(url, 'audio')
        await conn.sendMessage(m.chat, {
          audio: { url: directURL },
          fileName: `${safeTitle}.mp3`,
          mimetype: "audio/mpeg",
          ptt: false
        }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, `✦ Error downloading audio. Please try again later.\n\n${error.message}`, m)
      }
    } 
    else if (["play2", "ytmp4", "ytv", "mp4"].includes(command)) {
      try {
        const directURL = await getDirectURL(url, 'video')
        await conn.sendMessage(m.chat, {
          video: { url: directURL },
          fileName: `${safeTitle}.mp4`,
          caption: `${title}`,
          mimetype: "video/mp4"
        }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, `✦ Error downloading video. Please try again later.\n\n${error.message}`, m)
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
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
}
