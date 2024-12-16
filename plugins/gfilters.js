const { getFilter, bot, setFilter, deleteFilter } = require('../lib')

bot(
  {
    pattern: 'gstop ?(.*)',
    desc: 'Delete gfilters in all group',
    type: 'autoReply',
  },
  async (message, match) => {
    if (!match) return await message.send(`*Example : gstop hi*`)
    const isDel = await deleteFilter('gfilter', match, message.id)
    if (!isDel) return await message.send(`_${match} not found in gfilters_`)
    return await message.send(`_${match} deleted._`)
  }
)

bot(
  {
    pattern: 'pstop ?(.*)',
    desc: 'Delete pfilters in all chat',
    type: 'autoReply',
  },
  async (message, match) => {
    if (!match) return await message.send(`*Example : pstop hi*`)
    const isDel = await deleteFilter('pfilter', match, message.id)
    if (!isDel) return await message.send(`_${match} not found in pfilters_`)
    return await message.send(`_${match} deleted._`)
  }
)

bot(
  {
    pattern: 'gfilter ?(.*)',
    desc: 'gfilter in all groups',
    type: 'autoReply',
  },
  async (message, match) => {
    match = match.match(/[\'\"](.*?)[\'\"]/gms)
    if (!match) {
      const filters = await getFilter('gfilter', message.id)
      if (!filters.length)
        return await message.send(`_Not set any filter_\n*Example gfilter 'hi' 'hello'*`)
      let msg = ''
      filters.map(({ pattern }) => {
        msg += `=> ${pattern} \n`
      })
      return await message.send(msg.trim())
    } else {
      if (match.length < 2) {
        return await message.send(`Example gfilter 'hi' 'hello'`)
      }
      const k = match[0].replace(/['"]+/g, '')
      const v = match[1].replace(/['"]+/g, '')
      await setFilter('gfilter', k, v, match[0][0] === "'" ? true : false, message.id)
      await message.send(`_${k}_ added to gfilters.`)
    }
  }
)

bot(
  {
    pattern: 'pfilter ?(.*)',
    desc: 'pfilter in all chat',
    type: 'autoReply',
  },
  async (message, match) => {
    match = match.match(/[\'\"](.*?)[\'\"]/gms)
    if (!match) {
      const filters = await getFilter('pfilter', message.id)
      if (!filters.length)
        return await message.send(`_Not set any filter_\n*Example pfilter 'hi' 'hello'*`)
      let msg = ''
      filters.map(({ pattern }) => {
        msg += `=> ${pattern} \n`
      })
      return await message.send(msg.trim())
    } else {
      if (match.length < 2) {
        return await message.send(`Example pfilter 'hi' 'hello'`)
      }
      const k = match[0].replace(/['"]+/g, '')
      const v = match[1].replace(/['"]+/g, '')
      await setFilter('pfilter', k, v, match[0][0] === "'" ? true : false, message.id)
      await message.send(`_${k}_ added to pfilters.`)
    }
  }
)

bot(
  {
    on: 'text',
    fromMe: false,
    type: 'gfilter',
    onlyGroup: true,
  },
  async (message, match) => {
    const filters = await getFilter('gfilter', message.id)
    for (const { pattern, text } of filters) {
      const regexPattern = new RegExp(`(?:^|\\W)${pattern}(?:$|\\W)`, 'i')
      if (regexPattern.test(message.text)) {
        return await message.send(text, {
          quoted: message.data,
        })
      }
    }
  }
)

bot(
  {
    on: 'text',
    fromMe: false,
    type: 'pfilter',
  },
  async (message, match) => {
    if (message.isGroup) return
    const filters = await getFilter('pfilter', message.id)
    for (const { pattern, text } of filters) {
      const regexPattern = new RegExp(`(?:^|\\W)${pattern}(?:$|\\W)`, 'i')
      if (regexPattern.test(message.text)) {
        return await message.send(text, {
          quoted: message.data,
        })
      }
    }
  }
)
