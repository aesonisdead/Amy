// Created by Speed3xz
// API by russellxz (fixed & translated version)
import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

// ✅ Fixed API base (working and reliable)
const API_BASE = "https://api.dhamzxploit.my.id"
const API_KEY = "Russellxz" // kept same for compatibility

// Replace your existing skyYT function with this one
async function skyYT(url, format) {
  // list of candidate endpoints that return either mp3/mp4 or a generic dl_url
  const endpoints = [
    // primary candidate (audio/video endpoints)
    // (no API key required for these; we keep API_KEY in file for compatibility)
    (u) => `https://api.dhamzxploit.my.id/api/yta?url=${encodeURIComponent(u)}`,
    (u) => `https://api.akuari.my.id/downloader/youtube?link=${encodeURIComponent(u)}`,
    (u) => `https://api.lolhuman.xyz/api/youtube?link=${encodeURIComponent(u)}&apikey=hello`, // example (may require key)
    // fallback generic endpoints (try them if others fail)
    (u) => `https://api.sumanjay.workers.dev?url=${encodeURIComponent(u)}`,
  ]

  // helper to perform fetch with timeout
  const fetchWithTimeout = async (url, opts = {}, ms = 20000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), ms)
    try {
      const res = await fetch(url, { ...opts, signal: controller.signal })
      clearTimeout(id)
      return res
    } catch (err) {
      clearTimeout(id)
      throw err
    }
  }

  for (let makeEndpoint of endpoints) {
    const endpoint = makeEndpoint(url)
    try {
      console.log(`[skyYT] Trying endpoint: ${endpoint}`)
      // keep Authorization header for compatibility; if not needed API will ignore it
      const res = await fetchWithTimeout(endpoint, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }, 20000)

      if (!res.ok) {
        console.log(`[skyYT] Endpoint returned HTTP ${res.status} for ${endpoint}`)
        continue
      }

      const data = await res.json().catch(e => {
        console.log('[skyYT] Failed to parse JSON from', endpoint, e)
        return null
      })

      console.log('[skyYT] API RESPONSE:', endpoint, data)

      if (!data) continue

      // Normalize many common response shapes to { audio, video }
      // 1) some apis return { result: { dl_url: '...' } }
      if (data.result?.dl_url) {
        const dl = data.result.dl_url
        return { audio: dl, video: dl }
      }

      // 2) some return { url: '...' } or { data: { url: '...' } }
      if (data.url) return { audio: data.url, video: data.url }
      if (data.data?.url) return { audio: data.data.url, video: data.data.url }

      // 3) some return { mp3: '...', mp4: '...' } 
      if (data.mp3 || data.mp4) {
        return { audio: data.mp3 || data.mp4, video: data.mp4 || data.mp3 }
      }

      // 4) some return { result: { mp3: '...', mp4: '...' } }
      if (data.result?.mp3 || data.result?.mp4) {
        return { audio: data.result.mp3 || data.result.mp4, video: data.result.mp4 || data.result.mp3 }
      }

      // 5) some return { data: { audio: '...', video: '...' } }
      if (data.data?.audio || data.data?.video) {
        return { audio: data.data.audio, video: data.data.video }
      }

      // 6) some return { success: true, link: '...' } 
      if (data.link) return { audio: data.link, video: data.link }

      // if we reach here, endpoint responded but unrecognized shape
      console.log('[skyYT] Unrecognized API response shape, trying next endpoint.')
    } catch (err) {
      // network error, DNS error, timeout, etc.
      console.log('[skyYT] Endpoint error:', err.message || err)
      // continue to next endpoint
    }
  }

  // If all endpoints failed
  throw new Error('All downloader APIs failed or returned unexpected responses.')
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
╭──❀ Content Details ❀──╮
🎀 Title » *${title}*  
🌸 Channel » *${canal}*  
🍃 Views » *${vistas}*  
⏳ Duration » *${timestamp}*  
🗓️ Published » *${ago}*  
🔗 Link » *${url}*  
╰──────────────────────╯

> 𐙚🌷 ｡･ﾟ✧ Preparing your download... ˙𐙚🌸
    `.trim()

    // Send info message with image
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage
    }, { quoted: m })

    // Download & send directly
    if (["play", "ytaudio", "yta", "ytmp3", "mp3"].includes(command)) {
      try {
        const d = await skyYT(url, "audio")
        const mediaUrl = d.audio || d.video
        if (!mediaUrl) throw new Error("No audio URL obtained.")
        
        await conn.sendMessage(m.chat, {
          audio: { url: mediaUrl },
          fileName: `${title}.mp3`,
          mimetype: "audio/mpeg",
          ptt: false
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, "✦ The audio could not be downloaded. Please try again later.", m)
      }
    }
    else if (["play2", "ytmp4", "ytv", "mp4"].includes(command)) {
      try {
        const d = await skyYT(url, "video")
        const mediaUrl = d.video || d.audio
        if (!mediaUrl) throw new Error("No video URL obtained.")
        
        await conn.sendMessage(m.chat, {
          video: { url: mediaUrl },
          fileName: `${title}.mp4`,
          caption: `${title}`,
          mimetype: "video/mp4"
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})
      } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
        return conn.reply(m.chat, "✦ The video could not be downloaded. Please try again later.", m)
      }
    }

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
    return m.reply(`⚠︎ Unexpected error:\n\n${error.message}`)
  }
}

handler.command = handler.help = ["play", "ytaudio", "yta", "ytmp3", "mp3", "play2", "ytmp4", "ytv", "mp4"]
handler.tags = ["downloads"]

export default handler

function formatViews(views) {
  if (!views) return "Not available"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return views.toString()
          }
