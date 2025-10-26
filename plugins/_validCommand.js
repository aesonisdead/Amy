export async function before(m, { groupMetadata }) {
  if (!m.text || !global.prefix.test(m.text)) return
  const usedPrefix = global.prefix.exec(m.text)[0]
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()
  if (!command || command.length === 0) return

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (!plugin.command) continue
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
      for (let cmd of cmds) {
        if (cmd instanceof RegExp ? cmd.test(command) : cmd === command) {
          return true
        }
      }
    }
    return false
  }

  let chat = global.db.data.chats[m.chat]
  let settings = global.db.data.settings[this.user.jid]
  let owner = [...global.owner.map(([number]) => number)]
    .map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .includes(m.sender)

  if (chat.modoadmin) return
  if (settings.self) return
  if (command === 'mute') return
  if (chat.isMute && !owner) return
  if (command === 'bot') return
  if (chat.isBanned && !owner) return

  if (validCommand(command, global.plugins)) {
    // command exists, do nothing here
  } else {
    await m.reply(`🌷 *Command <${command}> Does Not Exist* 🌷\n\n┊ Use *${usedPrefix}help* to see the list of available commands.✨`)
  }
}
