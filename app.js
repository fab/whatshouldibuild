var request = require('request')
  , cheerio = require('cheerio')
  , http    = require('http')
  , ejs     = require('ejs')
  , fs      = require('fs')
  , path    = require('path')
  , mime    = require('mime')

var url = 'https://github.com/karan/Projects/blob/master/README-scratch.md'
  , projectsHTML

request(url, function (err, res, body) {
  projectsHTML = body
})

var server = http.createServer(function (req, res) {
  if (req.url.match(/css/)) {
    var css = fs.readFileSync(__dirname + '/public/style.css', 'utf-8')
    res.writeHead(200, {"Content-Type": "text/css"})
    res.write(css)
    res.end()
  }

  var index = fs.readFileSync(__dirname + '/public/index.html', 'utf-8')
  res.write(index)

  if (req.url.match(/suggest/)) {
    getRandomProject(function (title, description) {
      var data = fs.readFileSync(__dirname + '/public/project.ejs', 'utf-8')
      var html = ejs.render(data, { title: title, description: description})
      res.end(html)
    })
  }

  res.end()
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
