const base64 = () => { 
	return `
(m, { command, text }) => {
  let txt = m.quoted ? m.quoted.text ? m.quoted.text : text ? text : m.text : m.text
  m.reply(Buffer.from(txt, 'utf-8').toString('base64'))
}


eksports.base64 = base64