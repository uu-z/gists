let a = require("axios")
let fetch = require("node-fetch")
let cheerio = require("cheerio")


let main = async () => {
  let data = (await a("https://www.bilibili.com/ranking")).data
  let $ = cheerio.load(data)
  let urls = $(".img a").map((i, e) => `https:${$(e).prop("href")}`).get()

  urls.forEach(url => {
    getDanmus(url)
  })
}


let getDanmus = async (url) => {
  let zeroData = (await a(url)).data
  let cid = zeroData.match(/cid=\d+/)[0].substring(4)
  let aid = url.match(/av\d+/)[0].substring(2)

  let cxml = await (await fetch(`http://comment.bilibili.com/${cid}.xml`)).text()
  let $xml = cheerio.load(cxml, {
    xmlMode: true
  })
  let danmus = $xml("d").map((i, e) => $xml(e).text()).get()

  db.test.insert({
    cid,
    aid,
    danmus
  })
}

main()