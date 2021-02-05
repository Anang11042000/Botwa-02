const tutorialbot = () => { 
	return `
(m, { conn, usedPrefix: _p }) => {
  conn.reply(m.chat, `
Tutorial Buat Bot WA:
Credit: *ArdiGans YT*

Ketik di *[TERMUX]*
1) $pkg install git
2) $git clone https://github.com/ArdiGans007/Botku-02
3) $cd Botku-02
4) $ls
5) $cd Botku-02


yang *terakhirr*..
Penginstalannya cuy :)
6) npm i
7) node index.js

_Bisa kalian liat tutorialnya di_
*Youtube kami:*
https://www.youtube.com/c/ArdiGansYT
`.trim(), m)
}

exports.tutorialbot = tulorialbot

