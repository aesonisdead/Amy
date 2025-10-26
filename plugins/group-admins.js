const handler = async (m, { conn, participants, groupMetadata, args }) => {
  const primaryBot = global.db.data.chats[m.chat].primaryBot
  if (primaryBot && conn.user.jid !== primaryBot) throw !1

  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => 'https://files.catbox.moe/mq2yh8.jpg')
  const groupAdmins = participants.filter(p => p.admin)
  const listAdmin = groupAdmins.map(v => `● @${v.id.split('@')[0]}`).join('\n')
  const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'

  // ✅ Handle text after /a, /admins, or @admins
  const textInput = m.text.replace(/^(@admins|\/a|\/admins)\s*/i, '')
  const pesan = textInput.trim() ? textInput.trim() : 'Unspecified'

  const text = `『✦』Group admins:  
  
${listAdmin}

❍ Message » ${pesan}`

  await conn.sendFile(m.chat, pp, 'admins.jpg', text, m, false, {
    mentions: [...groupAdmins.map(v => v.id), owner]
  })
}

handler.help = ['admins']
handler.tags = ['group']

// Normal prefix commands
handler.command = ['admins', 'a']

// Custom prefix for @admins
handler.customPrefix = /^@admins/i

handler.group = true

export default handler
