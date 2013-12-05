var request = require('request')
  , cheerio = require('cheerio')
  , http    = require('http')
  , ejs     = require('ejs')
  , fs      = require('fs')

var url = 'https://github.com/karan/Projects/blob/master/README-scratch.md'
  , projectsHTML

request(url, function (err, res, body) {
  projectsHTML = body
})

var server = http.createServer(function (req, res) {
  fs.readFile(__dirname + '/index.html', 'utf-8', function (err, data) {
    if (err) throw err
    res.write(data)
  })

  if (req.url.match(/suggest/)) {
    getRandomProject(function (title, description) {
      fs.readFile(__dirname + '/project.ejs', 'utf-8', function (err, data) {
        if (err) throw err
        var html = ejs.render(data, { title: title, description: description})
        res.end(html)
      })
    })
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
