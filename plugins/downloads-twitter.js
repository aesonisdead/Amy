let handler = async (m, { conn, args, text }) => {
if (!text) {
return conn.reply(m.chat, `❀ You missed the link to a Twitter image/video..`, m)
}
try {
await m.react('🕒')
const result = await twitterScraper(text);
if (!result.status) return conn.reply(m.chat, `ꕥ Could not get content from Twitter`, m)
if (result.data.type === 'video') {
let caption = `❀ Twitter - Downloader ❀

> ✦ Title » ${result.data.title}
> ⴵ Duration » ${result.data.duration}
> 🜸 URL » ${text}`
 conn.sendFile(m.chat, result.data.dl[0].url, "video.mp4", caption, m)
 await m.react('✔️')
} else {
await conn.sendMessage(m.chat, {
image: { url: result.data.imageUrl },
caption: `❀ Twitter - Downloader ❀\n\n> 🜸 URL » ${text}`}, { quoted: m })
 await m.react('✔️')
}} catch (e) {
await m.react('✖️')
return conn.reply(m.chat, `⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${e.message}`, m)
}}

handler.command = ["x", "twitter", "xdl"]
handler.help = ["twitter"]
handler.tags = ["media"]
handler.group = true

export default handler

async function twitterScraper(url) {
return new Promise(async (resolve, reject) => {
try {
const twitterUrlMatch = url.match(/(https:\/\/x.com\/[^?]+)/)
const tMatch = url.match(/t=([^&]+)/)
const twitterUrl = twitterUrlMatch ? twitterUrlMatch[1] : ''
const t = tMatch ? tMatch[1] : ''
const urlnya = encodeURIComponent(`${twitterUrl}?t=${t}&s=19`)
const response = await axios.post("https://savetwitter.net/api/ajaxSearch",
`q=${urlnya}&lang=en`)
const $ = cheerio.load(response.data.data)
const isVideo = $('.tw-video').length > 0
const twitterId = $('#TwitterId').val()
if (isVideo) {
const videoThumbnail = $('.tw-video .thumbnail .image-tw img').attr('src')
const data = []
$('.dl-action a').each((i, elem) => {
const quality = $(elem).text().trim()
const url = $(elem).attr('href')
if ($(elem).hasClass('action-convert')) {
const audioUrl = $(elem).attr('data-audioUrl')
data.push({
quality: quality,
url: audioUrl || 'URL not found',
})
} else {
data.push({
quality: quality,
url: url
})
}})
const title = $('.tw-middle h3').text().trim()
const videoDuration = $('.tw-middle p').text().trim()
resolve({
status: true,
data: {
type: "video",
title: title,
duration: videoDuration,
twitterId: twitterId,
videoThumbnail: videoThumbnail,
dl: data
}})
} else {
const imageUrl = $('.photo-list .download-items__thumb img').attr('src')
const downloadUrl = $('.photo-list .download-items__btn a').attr('href')
resolve({
status: true,
data: {
type: "image",
twitterId: twitterId,
imageUrl: imageUrl,
dl: downloadUrl
}})
}} catch (error) {
reject(error)
}})
}
