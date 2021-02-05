const pantun = () => { 
	return `
(m, { conn }) => {
  conn.reply(m.chat,`“${pickRandom(global.pantun)}”`, m)
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

global.pantun = [
" *PANTUN:*\n\nAda anak kecil bermain batu,\nBatu dilempar masuk ke sumur,\nBelajar itu tak kenal waktu,\nJuga tidak memandang umur.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nTanam kacang di pagi hari,\nTumbuh enam layu sebatang,\nKeburukan orang jangan dicari,\nBila kalian sedang puasa.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nAkhir bulan mendapat gaji,\nGaji untuk membeli ketupat,\nRajin-rajinlah sholat dan mengaji,\nJanganlah lupa puasa dan zakat.\n *Bye Youtube:* @ArdiGans YT",
" *PANTUN:*\n\nWaktu daftar hari terakhir,\nWaktu terasa banyak terbuang,\nKamu nggak perlu khawatir,\ncintaku hanya untukmu seorang.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nAda anak kecil bermain batu,\nBatu dilempar masuk ke sumur,\nBelajar itu tak kenal waktu,\nJuga tidak memandang umur.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nSeribu bebek di kandang singa,\nhanya satu berwarna belang,\nBeribu cewek di Indonesia,\nhanya engkau yang aku sayang.\n *Bye Youtube:* @ArdiGans YT",
" *PANTUN:*\n\nHari minggu pergi ke pasar,\nBeli sayur dan juga beras,\nTiap hari harus belajar,\nPasti akan menjadi cerdas.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nAyam goreng setengah mateng,\nBelinya di depan tugu.\nAbang sayang, abangku ganteng,\nlneng di sini setia menunggu.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nApi kecil dari tungku,\nApinya kecil habis kayu.\nSudah lama kutunggu-tunggu,\nkapan kamu bilang I love you.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nSeribu bebek di kandang singa,\nhanya satu berwarna belang\nBeribu cewek di Indonesia,\nhanya engkau yang aku sayang.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nPergi memancing saat fajar,\nPulang siang membawa ikan\nSiapa yang rajin belajar\nJadi orang sukses kemudian.\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nBeli computer itu biasa\nSupaya belajar jadi semangat\nMari kita belajar puasa\nAgar kita jadi kuat\n *Bye YouTube:* @ArdiGans YT",
" *PANTUN:*\n\nMinum sekoteng hangat rasanya,\nminum segelas ada yang minta.\nLaki-laki ganteng siapa yang punya?\nBolehkah aku jatuh cinta.\n *Bye Youtube:* @ArdiGans YT",
]

eksports.pantun = pantun
