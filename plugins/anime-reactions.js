import fetch from 'node-fetch'

let handler = async (m, { conn, command, usedPrefix }) => {
let mentionedJid = await m.mentionedJid
let userId = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? await m.quoted.sender : m.sender)
let from = await (async () => global.db.data.users[m.sender].name || (async () => { try { const n = await conn.getName(m.sender); return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })())()
let who = await (async () => global.db.data.users[userId].name || (async () => { try { const n = await conn.getName(userId); return typeof n === 'string' && n.trim() ? n : userId.split('@')[0] } catch { return userId.split('@')[0] } })())()
let str, query
switch (command) {
case 'angry': case 'enojado':
str = from === who ? `\`${from}\` is angry! 凸ಠ益ಠ)凸` : `\`${from}\` is angry from \`${who}\`! 凸ಠ益ಠ)凸`
query = 'anime angry'
break
case 'bath': case 'bañarse':
str = from === who ? `\`${from}\` is bathing! ٩(ˊᗜˋ )و` : `\`${from}\` is bathing \`${who}\`! ٩(ˊᗜˋ )و`
query = 'anime bath'
break
case 'bite': case 'morder':
str = from === who ? `\`${from}\` bit himself/herself! ≽^•⩊•^≼` : `\`${from}\` bit \`${who}\`! ≽^•⩊•^≼`
query = 'anime bite'
break
case 'bleh': case 'lengua':
str = from === who ? `\`${from}\` stick out your tongue! (｡╹ω╹｡)` : `\`${from}\` stuck out his/her tongue at \`${who}\`! (｡╹ω╹｡)`
query = 'anime bleh'
break
case 'blush': case 'sonrojarse':
str = from === who ? `\`${from}\` blushed! ( ˶o˶˶o˶)` : `\`${from}\` blushed at \`${who}\`! ( ˶o˶˶o˶)`
query = 'anime blush'
break
case 'bored': case 'aburrido':
str = from === who ? `\`${from}\` is bored! ( ¬_¬)` : `\`${from}\` is bored of \`${who}\`! ( ¬_¬)`
query = 'anime bored'
break
case 'clap': case 'aplaudir':
str = from === who ? `\`${from}\` is clapping! (୨୧•͈ᴗ•͈)` : `\`${from}\` is clapping for \`${who}\`! (୨୧•͈ᴗ•͈)`
query = 'anime clap'
break
case 'coffee': case 'cafe': case 'café':
str = from === who ? `\`${from}\` is drinking coffee! ٩(●ᴗ●)۶` : `\`${from}\` is drinking coffee with \`${who}\`! ٩(●ᴗ●)۶`
query = 'anime coffee'
break
case 'cry': case 'llorar':
str = from === who ? `\`${from}\` is crying! (╥_╥)` : `\`${from}\` is crying for \`${who}\`! (╥_╥)`
query = 'anime cry'
break
case 'cuddle': case 'acurrucarse':
str = from === who ? `\`${from}\` cuddles with himself/herself! ꒰ঌ(˶ˆᗜˆ˵)໒꒱` : `\`${from}\` cuddles with \`${who}\`! ꒰ঌ(˶ˆᗜˆ˵)໒꒱`
query = 'anime cuddle'
break
case 'dance': case 'bailar':
str = from === who ? `\`${from}\` is dancing! (ﾉ^ヮ^)ﾉ*:・ﾟ✧` : `\`${from}\` is dancing with \`${who}\`! (ﾉ^ヮ^)ﾉ*:・ﾟ✧`
query = 'anime dance'
break
case 'drunk': case 'borracho':
str = from === who ? `\`${from}\` is drunk! (⸝⸝๑﹏๑⸝⸝)` : `\`${from}\` is drunk with \`${who}\`! (⸝⸝๑﹏๑⸝⸝)`
query = 'anime drunk'
break
case 'eat': case 'comer':
str = from === who ? `\`${from}\` is eating! (っ˘ڡ˘ς)` : `\`${from}\` is eating with \`${who}\`! (っ˘ڡ˘ς)`
query = 'anime eat'
break
case 'facepalm': case 'palmada':
str = from === who ? `\`${from}\` slaps himself in the face! (ভ_ ভ) ރ` : `\`${from}\` gets frustrated and slaps himself in the face for \`${who}\`! (ভ_ ভ) ރ`
query = 'anime facepalm'
break
case 'happy': case 'feliz':
str = from === who ? `\`${from}\` is happy! ٩(˶ˆᗜˆ˵)و` : `\`${from}\` is happy for \`${who}\`! ٩(˶ˆᗜˆ˵)و`;
query = 'anime happy';
break
case 'hug': case 'abrazar':
str = from === who ? `\`${from}\` hugged himself/herself! (づ˶•༝•˶)づ♡` : `\`${from}\` hugged \`${who}\`! (づ˶•༝•˶)づ♡`;
query = 'anime hug'
break
case 'kill': case 'matar':
str = from === who ? `\`${from}\` killed himself/herself! ( ⚆ _ ⚆ )` : `\`${from}\` killed \`${who}\`! ( ⚆ _ ⚆ )`
query = 'anime kill'
break
case 'kiss': case 'muak': case 'beso':
str = from === who ? `\`${from}\` kissed himself/herself! ( ˘ ³˘)♥` : `\`${from}\` kissed \`${who}\`! ( ˘ ³˘)♥`
query = 'anime kiss'
break
case 'laugh': case 'reirse':
str = from === who ? `\`${from}\` laughs! (≧▽≦)` : `\`${from}\` is laughing at \`${who}\`! (≧▽≦)`
query = 'anime laugh'
break
case 'lick': case 'lamer':
str = from === who ? `\`${from}\` licked himself/herself!（＾ω＾）` : `\`${from}\` licked \`${who}\`!（＾ω＾）`
query = 'anime lick'
break
case 'slap': case 'bofetada':
str = from === who ? `\`${from}\` slapped himself/herself! ᕙ(⇀‸↼‵‵)ᕗ` : `\`${from}\` slapped \`${who}\`! ᕙ(⇀‸↼‵‵)ᕗ`
query = 'anime slap'
break
case 'sleep': case 'dormir':
str = from === who ? `\`${from}\` is sleeping soundly! (∪｡∪)｡｡｡zzz` : `\`${from}\` sleeps next to \`${who}\`! (∪｡∪)｡｡｡zzz`
query = 'anime sleep'
break
case 'smoke': case 'fumar':
str = from === who ? `\`${from}\` is smoking! (￣ー￣)_旦~` : `\`${from}\` is smoking with \`${who}\`! (￣ー￣)_旦~`
query = 'anime smoke'
break
case 'spit': case 'escupir':
str = from === who ? `\`${from}\` he/she spat on himself/herself! ٩(๑˘^˘๑)۶` : `\`${from}\` spat at \`${who}\`! ٩(๑˘^˘๑)۶`
query = 'anime spit'
break
case 'step': case 'pisar':
str = from === who ? `\`${from}\` stepped on himself/herself! ಥ_ಥ` : `\`${from}\` stepped on \`${who}\`! sin piedad`
query = 'anime step'
break
case 'think': case 'pensar':
str = from === who ? `\`${from}\` is thinking! (⸝⸝╸-╺⸝⸝)` : `\`${from}\` is thinking about \`${who}\`! (⸝⸝╸-╺⸝⸝)`
query = 'anime think'
break
case 'love': case 'enamorado': case 'enamorada':
str = from === who ? `\`${from}\` is in love with himself/herself! (≧◡≦) ♡` : `\`${from}\` is in love with \`${who}\`! (≧◡≦) ♡`
query = 'anime love'
break
case 'pat': case 'palmadita': case 'palmada':
str = from === who ? `\`${from}\` pats himself in self-support! ଘ(੭ˊᵕˋ)੭` : `\`${from}\` gently caresses \`${who}\`! ଘ(੭ˊᵕˋ)੭`
query = 'anime pat'
break
case 'poke': case 'picar':
str = from === who ? `\`${from}\` a curious touch is given! (,,◕.◕,,)` : `\`${from}\` tap on \`${who}\`! (,,◕.◕,,)`
query = 'anime poke'
break
case 'pout': case 'pucheros':
str = from === who ? `\`${from}\` pouts! (๑•́ ₃ •̀๑)` : `\`${from}\` is pouting for \`${who}\`! (๑•́ ₃ •̀๑)`
query = 'anime pout'
break
case 'punch': case 'pegar': case 'golpear':
str = from === who ? `\`${from}\` hit himself/herself! (ദി˙ᗜ˙)` : `\`${from}\` hits \`${who}\`! with all his might (ദ്ദി˙ᗜ˙)`
query = 'anime punch'
break
case 'preg': case 'preñar': case 'embarazar':
str = from === who ? `\`${from}\` got pregnant alone... mysterious! (¬ω¬)` : `\`${from}\` made \`${who}\` pregnant! (¬ω¬)`
query = 'anime preg'
break
case 'run': case 'correr':
str = from === who ? `\`${from}\` is doing cardio... or so they say.! ┗(＾0＾)┓` : `\`${from}\` runs away when he sees \`${who}\` approach! ┗(＾0＾)┓`
query = 'anime run'
break
case 'sad': case 'triste':
str = from === who ? `\`${from}\` looks at the rain with a sad expression! (｡•́︿•̀｡)` : `\`${from}\` look out the window and thinks about \`${who}\`! (｡•́︿•̀｡)`
query = 'anime sad'
break
case 'scared': case 'asustada': case 'asustado':
str = from === who ? `\`${from}\` gets scared! (꒪ཀ꒪)` : `\`${from}\` is terrified of \`${who}\`! (꒪ཀ꒪)`
query = 'anime scared'
break
case 'seduce': case 'seducir':
str = from === who ? `\`${from}\` whispers love verses into the air! ( ͡° ͜ʖ ͡°)` : `\`${from}\` throws a look that melts \`${who}\`! ( ͡° ͜ʖ ͡°)`
query = 'anime seduce'
break
case 'shy': case 'timido': case 'timida':
str = from === who ? `\`${from}\` doesn't know how to act... turns red! (⸝⸝⸝-﹏-⸝⸝⸝)` : `\`${from}\` looks down shyly in front of \`${who}\`! (⸝⸝⸝-﹏-⸝⸝⸝)`
query = 'anime shy'
break
case 'walk': case 'caminar':
str = from === who ? `\`${from}\` walks! ┌( ಠ‿ಠ)┘` : `\`${from}\` is walking with \`${who}\`! ┌( ಠ‿ಠ)┘`;
query = 'anime walk' 
break
case 'dramatic': case 'drama':
str = from === who ? `\`${from}\` is putting on a show worthy of an Oscar! (┬┬﹏┬┬)` : `\`${from}\` is acting dramatically by \`${who}\`! (┬┬﹏┬┬)`
query = 'anime dramatic'
break
case 'kisscheek': case 'beso':
str = from === who ? `\`${from}\` he kissed her cheek affectionately! (˶ ˘ ³˘)` : `\`${from}\` kissed the cheek of \`${who}\` with tenderness! (˶ ˘ ³˘)`
query = 'anime kisscheek'
break
case 'wink': case 'guiñar':
str = from === who ? `\`${from}\` winked at himself/herself in the mirror! (⸝⸝> ᴗ•⸝⸝)` : `\`${from}\` winked at \`${who}\`! (⸝⸝> ᴗ•⸝⸝)`
query = 'anime wink'
break
case 'cringe': case 'avergonzarse':
str = from === who ? `\`${from}\` feel cringe! (ᇂ_ᇂ|||)` : `\`${from}\` feels cringe for \`${who}\`! (ᇂ_ᇂ|||)`
query = 'anime cringe'
break
case 'smug': case 'presumir':
str = from === who ? `\`${from}\` he's been showing off a lot lately! ପ(๑•ᴗ•๑)ଓ` : `\`${from}\` is bragging to \`${who}\`! ପ(๑•ᴗ•๑)ଓ`
query = 'anime smug'
break
case 'smile': case 'sonreir':
str = from === who ? `\`${from}\` is smiling! ( ˶ˆᗜˆ˵ )` : `\`${from}\` smiled at \`${who}\`! ( ˶ˆᗜˆ˵ )`
query = 'anime smile'
break
case 'clap': case 'aplaudir':
str = from === who ? `\`${from}\` is clapping for something! (୨୧•͈ᴗ•͈)` : `\`${from}\` is clapping for \`${who}\`! (୨୧•͈ᴗ•͈)`
query = 'anime clap'
break
case 'highfive': case '5':
str = from === who ? `\`${from}\` high-fived themselves in front of the mirror! (•̀o•́)ง` : `\`${from}\` high-fived \`${who}\`! (•̀o•́)ง٩(ˊᗜˋ)`
query = 'anime highfive'
break
case 'handhold': case 'mano':
str = from === who ? `\`${from}\` shook hands with himself/herself! (∩•̀ω•́)⊃` : `\`${from}\` grabbed her hand \`${who}\`! (∩•̀ω•́)⊃`
query = 'anime handhold'
break
case 'bullying': case 'bully':
str = from === who ? `\`${from}\` bullies himself... someone hug him/her! ༼ ಠДಠ ༽` : `\`${from}\` is bullying \`${who}\`! ༼ ಠДಠ ༽`
query = 'anime bullying'
break
case 'wave': case 'hola': case 'ola':
str = from === who ? `\`${from}\` greeted himself/herself in the mirror! (๑˃̵ᴗ˂̵)و` : `\`${from}\` is greeting \`${who}\`! (๑˃̵ᴗ˂̵)و`
query = 'anime wave'
break
}
if (m.isGroup) {
try {
const res = await fetch(`${global.APIs.delirius.url}/search/tenor?q=${query}`)
const json = await res.json()
const gifs = json.data
if (!gifs || gifs.length === 0) return m.reply('ꕥ No results found.')
const randomGif = gifs[Math.floor(Math.random() * gifs.length)].mp4
conn.sendMessage(m.chat, { video: { url: randomGif }, gifPlayback: true, caption: str, mentions: [who] }, { quoted: m })
} catch (e) {
return m.reply(`⚠︎ A problem has occurred.\n> Use *${usedPrefix}report* to report it.\n\n${e.message}`)
}}}

handler.help = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'run', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'clap', 'aplaudir', 'highfive', '5', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola', 'beso']
handler.tags = ['anime']
handler.command = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'run', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'clap', 'aplaudir', 'highfive', '5', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola', 'beso']
handler.group = true

export default handler
