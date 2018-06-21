const axios = require("axios")
const _ = require("lodash")

const crawl = async () => {
  const start = db.video.count()
  const end = start + 50

  let req = await Promise.all(
    _.range(start, end)
      .map(i => `http://api.bilibili.com/archive_stat/stat?aid=${i}`)
      .map(i => axios.get(i))
  )

  let data = req.map(i => i.data)
  db.video.insertMany(data)
}

_.times(2000, i => {
  crawl()
})