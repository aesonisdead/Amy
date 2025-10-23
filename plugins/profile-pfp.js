let handler = async (m, { conn }) => {
  // Get mentioned user or quoted user
  let mentionedJid = m.mentionedJid?.[0];
  let who = m.quoted?.sender || mentionedJid;

  if (!who) {
    return conn.sendMessage(
      m.chat,
      { text: '❀ Por favor, menciona al usuario que deseas ver su foto de perfil.' },
      { quoted: m }
    );
  }

  // Get name safely from DB or fallback to WhatsApp name or JID
  let name = global.db?.data?.users?.[who]?.name || await (async () => {
    try {
      const n = await conn.getName(who);
      return typeof n === 'string' && n.trim() ? n : who.split('@')[0];
    } catch {
      return who.split('@')[0];
    }
  })();

  // Get profile picture, fallback if not available
  let pp = await conn.profilePictureUrl(who, 'image').catch(() => 
    'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg'
  );

  // React and send the profile picture
  await m.react('🕒');
  await conn.sendFile(m.chat, pp, 'profile.jpg', `❀ *Foto de perfil de ${name}*`, m);
  await m.react('✔️');
};

handler.help = ['pfp'];
handler.tags = ['sticker'];
handler.command = ['pfp', 'getpic'];

export default handler;
