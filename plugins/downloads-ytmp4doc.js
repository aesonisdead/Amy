import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = {
  checkProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);

        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `💜 Enter the name of the video to download.`, m);
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No results were found for your search..');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, url } = videoInfo;
    const thumb = (await conn.getFile(thumbnail))?.data;

    if (command === 'ytvddoc' || command === 'ytvdoc' || command === 'ytmp4doc') {
      let sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const { data, result, downloads } = await res.json();
          let downloadUrl = data?.dl || result?.download?.url || downloads?.url || data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              document: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
              caption: `Here is your video.`,
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply(`Video could not be downloaded: No valid download link found.`);
      }
    } else {
      throw "Unrecognized command.";
    }
  } catch (error) {
    return m.reply(`Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ['ytmp4doc', 'ytvdoc', 'ytdoc'];
handler.tags = ['media'];

export default handler;
