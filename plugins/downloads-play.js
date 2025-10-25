// Creado por Speed3xz
// Api by russellxz
import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

// Replaced API logic — the constants below are no longer used, but kept for structure
const API_BASE = "https://esm.apiis.dpdns.org/youtube/ytdl"
const API_KEY = "anya-md"

async function skyYT(url, format) {
  try {
    const type = format === "audio" ? "mp3" : "mp4"
    const apiUrl = `${API_BASE}?apikey=${API_KEY}&type=${type}&url=${encodeURIComponent(url)}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (!json?.result) throw new Error("Invalid API response")
    return json.result
  } catch (err) {
    throw new Error(`API Error: ${err.message}`)
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

    // Send image and info
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage
    }, { quoted: m })

    // Download and send directly
    if (["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command)) {
      try {
        const d = await skyYT(url, "audio")
        const mediaUrl = d.audio || d.video || d.url
        if (!mediaUrl) throw new Error("No audio URL obtained")
        
        await conn.sendMessage(m.chat, {
          audio: { url: mediaUrl },
          fileName: `${title}.mp3`,
          mimetype: "audio/mpeg",
          ptt: false
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, "✦ Error downloading audio. Please try again later.", m)
      }
    }
    else if (["play2", "ytmp4", "ytv", "mp4"].includes(command)) {
      try {
        const d = await skyYT(url, "video")
        const mediaUrl = d.video || d.audio || d.url
        if (!mediaUrl) throw new Error("No video URL obtained")
        
        await conn.sendMessage(m.chat, {
          video: { url: mediaUrl },
          fileName: `${title}.mp4`,
          caption: `${title}`,
          mimetype: "video/mp4"
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, "✦ Error downloading video. Please try again later..", m)
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
