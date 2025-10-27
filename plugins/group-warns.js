import db from '../lib/database.js'

const handler = async (m, { conn, text, command, usedPrefix }) => {
  try {
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://files.catbox.moe/mq2yh8.jpg')
    let mentionedJid = await m.mentionedJid
    let who = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
    const usuario = conn.user.jid.split`@`[0] + '@s.whatsapp.net'
    const groupInfo = await conn.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

    // Ensure chat users object exists
    const chatData = global.db.data.chats[m.chat] || { users: {} }
    chatData.users = chatData.users || {}
    global.db.data.chats[m.chat] = chatData

    switch (command) {
      // Add warning
      case 'wrn': case 'warn': case 'addwarn': {
        if (!who || typeof who !== 'string' || !who.includes('@')) {
          return m.reply(`❀ You must mention or quote a user to apply a warning.\n> Example: *${usedPrefix + command} @user (reason | optional)*`)
        }

        if (who === conn.user.jid) return conn.reply(m.chat, `ꕥ I can't give the bot warnings.`, m)
        if (who === ownerGroup) return conn.reply(m.chat, `ꕥ I can't give warnings to the group owner.`, m)
        if (who === ownerBot) return conn.reply(m.chat, `ꕥ I can't give warnings to the bot owner.`, m)

        const msgtext = text?.trim() || ''
        const partes = msgtext.split(/\s+/)
        const tieneMencion = partes.some(part => part.startsWith('@'))
        const motivo = tieneMencion ? partes.filter(part => !part.startsWith('@')).join(' ').trim() || 'Unspecified' : msgtext || 'Unspecified'

        // Ensure the target user object exists
        const targetUser = chatData.users[who] || {}
        targetUser.warn = (targetUser.warn || 0) + 1
        chatData.users[who] = targetUser
        global.db.data.chats[m.chat] = chatData

        await m.reply(`*@${who.split`@`[0]}* You received a warning in this group!\nReason: ${motivo}\n*Warnings: ${targetUser.warn}/3*`, null, { mentions: [who] })

        if (targetUser.warn >= 3) {
          targetUser.warn = 0
          chatData.users[who] = targetUser
          global.db.data.chats[m.chat] = chatData
          await m.reply(`❀ You have been warned multiple times!\n*@${who.split`@`[0]}* Exceeded *3* warnings, will now be removed from the group.`, null, { mentions: [who] })
          await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
        }
        break
      }

      // Remove warning
      case 'delwarn': case 'unwarn' case 'delwrn': {
        if (!who) return m.reply(`❀ Tag a user to remove warnings.`)
        if (mentionedJid.includes(conn.user.jid)) return

        const targetUser = chatData.users[who] || {}
        if (!targetUser.warn || targetUser.warn <= 0) throw `ꕥ The user has 0 warnings.`

        targetUser.warn -= 1
        chatData.users[who] = targetUser
        global.db.data.chats[m.chat] = chatData

        await m.reply(`${targetUser.warn === 1 ? `*@${who.split`@`[0]}*` : `❀ *@${who.split`@`[0]}*`} A warning was removed.\n*WARNINGS ${targetUser.warn}/3*`, null, { mentions: [who] })
        break
      }

      // List warnings
      case 'listwrn': case 'wrnlist' case 'warnings': {
        const users = chatData.users || {}
        const adv = Object.entries(users).filter(([_, u]) => u.warn && u.warn > 0)

        const listadvs = `❀ Warned Users\n\n*Total : ${adv.length} Users*${adv.length > 0 ? '\n' + adv.map(([jid, u]) => `*●* @${jid.split`@`[0]} : *(${u.warn}/3)*`).join('\n') : ''}`

        await conn.sendMessage(
          m.chat,
          { image: { url: pp }, caption: listadvs, mentions: adv.map(([jid]) => jid) },
          { quoted: m }
        )
        break
      }
    }
  } catch (error) {
    m.reply(`⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${error.message}`)
  }
}

handler.command = ['wrn', 'warn', 'addwarn', 'delwarn', 'unwarn', 'delwrn', 'listwrn', 'wrnlist', 'warnings']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
