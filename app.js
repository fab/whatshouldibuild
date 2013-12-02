var request = require('request')
  , cheerio = require('cheerio')
  , http    = require('http')

var url = 'https://github.com/karan/Projects/blob/master/README-scratch.md'
  , projectsHTML

request(url, function (err, res, body) {
  projectsHTML = body
})

var server = http.createServer(function (req, res) {
  var buttonHTML = '<a href="/suggest">What Should I Build?</a>'

  if (req.url.match(/suggest/)) {
    getRandomProject(function (title, description) {
      res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8' });
      res.write(buttonHTML)
      res.end('<div>' + title + '</div>' + '<div>' + description + '</div>')
    })
  } else {
    res.end(buttonHTML)
  }
})

var port = process.env.PORT || 8000

server.listen(port, function () {
  console.log('Listening on port ' + port)
})

function getRandomProject(callback) {
  $ = cheerio.load(projectsHTML)
  var projects = $('.markdown-body p')
    , randNum = Math.floor(Math.random() * projects.length)
    , project = $(projects)[randNum]
    , title = $(project).find('strong').text()
    , description = $(project).text().slice(title.length + 3)

  callback(title, description)
}
