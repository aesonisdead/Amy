// Created by Speed3xz
// Fixed and translated by Aethon
import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

// ✅ Working API (no key needed)
const API_BASE = "https://api.kenliejugarap.com"

async function skyYT(url, format) {
  const endpoint = format === "audio" 
    ? `${API_BASE}/api/youtube/audio?url=${encodeURIComponent(url)}`
    : `${API_BASE}/api/youtube/video?url=${encodeURIComponent(url)}`
  
  const response = await fetch(endpoint)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data = await response.json()
  console.log("API RESPONSE:", data) // debug
  
  if (!data?.url) throw new Error(data?.message || "API Error")
  
  return data.url
}

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `✧ 𝙃𝙚𝙮! You must type *the name or link* of the video/audio to download.`, m)
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key }})

    let videoIdToFind = text.match(youtubeRegexID)
    let searchResults = await yts(videoIdToFind ? videoIdToFind[1] : text)
    
    let ytplay2 = searchResults.videos?.[0]
    if (!ytplay2) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
      return m.reply("⚠︎ No results found. Try another name or link.")
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
    const vistas = formatViews(views)
    const canal = author?.name || "Unknown"

    const infoMessage = `
╭──❀ Content Details ❀──╮
🎀 Title » *${title}*  
🌸 Channel » *${canal}*  
🍃 Views » *${vistas}*  
⏳ Duration » *${timestamp}*  
🗓️ Uploaded » *${ago}*  
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
        const mediaUrl = await skyYT(url, "audio")
        await conn.sendMessage(m.chat, {
          audio: { url: mediaUrl },
          fileName: `${title}.mp3`,
          mimetype: "audio/mpeg",
          ptt: false
        }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        console.log(error)
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, "✦ The audio could not be downloaded. Please try again later.", m)
      }
    } 
    else if (["play2", "ytmp4", "ytv", "mp4"].includes(command)) {
      try {
        const mediaUrl = await skyYT(url, "video")
        await conn.sendMessage(m.chat, {
          video: { url: mediaUrl },
          fileName: `${title}.mp4`,
          caption: `${title}`,
          mimetype: "video/mp4"
        }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        console.log(error)
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, "✦ The video could not be downloaded. Please try again later.", m)
      }
    }

  } catch (error) {
    console.log(error)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
    return m.reply(`⚠︎ Unexpected error:\n\n${error.message}`)
  }
}

handler.command = handler.help = ["play", "ytaudio", "yta", "ytmp3", "mp3", "play2", "ytmp4", "ytv", "mp4"]
handler.tags = ["downloads"]

export default handler

function formatViews(views) {
  if (!views) return "Unavailable"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
}
