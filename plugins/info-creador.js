import PhoneNumber from 'awesome-phonenumber'

async function handler(m, { conn }) {
  m.react('📇')

  const contactos = [
    {
      numero: '212605158422',
      nombre: 'Salim 👻',
      cargo: 'Main Owner',
      nota: 'Bot Creator',
      region: '🇬🇷 Greece',
      web: 'https://github.com/aethonxei',
      biografia: await conn.fetchStatus('212605158422@s.whatsapp.net').then(res => res.status).catch(_ => 'No biography')
    }
  ]

  const contactArray = contactos.map(c => [
    c.numero,
    c.nombre,
    c.cargo,
    c.nota,
    c.region,
    c.web,
    c.biografia
  ])

  await sendContactArray(conn, m.chat, contactArray, m)
}

handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = ['owner', 'creator']

export default handler

async function sendContactArray(conn, jid, data, quoted, options) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
  let contacts = []
  for (let [number, name, title, note, email, region, url, bio] of data) {
    number = number.replace(/[^0-9]/g, '')
    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, '\\n')};;;
FN:${name.replace(/\n/g, '\\n')}
item.ORG:${title}
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:${note}
item2.EMAIL;type=INTERNET:${email}
item2.X-ABLabel:Correo
item3.ADR:;;${region};;;;
item3.X-ABADR:ac
item3.X-ABLabel:Región
item4.URL:${url}
item4.X-ABLabel:Sitio Web
item5.X-ABLabel:${bio}
END:VCARD`.trim()
    contacts.push({ vcard, displayName: name })
  }

  return await conn.sendMessage(jid, {
    contacts: {
      displayName: 'Bot Owners',
      contacts,
    }
  }, {
    quoted,
    ...options
  })
}
