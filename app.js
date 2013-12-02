var request = require('request')
  , cheerio = require('cheerio')
  , http    = require('http')

var url = 'https://github.com/karan/Projects/blob/master/README-scratch.md'

var server = http.createServer(function (req, res) {
  getRandomProject(function (title, description) {
    res.end(title + "\n" + description)
  })
})

server.listen(8000)

function getRandomProject(callback) {
  request(url, function (err, res, body) {
    $ = cheerio.load(body)
    var projects = $('.markdown-body p')
      , randNum = Math.floor(Math.random() * projects.length)
      , project = $(projects)[randNum]
      , title = $(project).find('strong').text()
      , description = $(project).text().slice(title.length + 3)

    callback(title, description)
  })
}
