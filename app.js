var request = require('request')
  , cheerio = require('cheerio')
  , http    = require('http')

var url = 'https://github.com/karan/Projects/blob/master/README-scratch.md'
  , projectsHTML

request(url, function (err, res, body) {
  projectsHTML = body
})

var server = http.createServer(function (req, res) {
  var buttonHTML = '<a href="/suggest" style="padding: 10px 20px 10px 20px;' +
      'border-radius: 5px; background: blue; text-decoration: none;' +
      'color: white; font-size: 50px;">What Should I Build?</a>'

  res.write('<!doctype html><html lang="en">' +
    '<head><meta charset="utf-8"><title>What Should I Build?</title>' +
    '<link href="http://fonts.googleapis.com/css?family=Signika+Negative"' +
    'rel="stylesheet" type="text/css"><style type="text/css">' +
    'body {font-family:"Signika Negative", sans-serif; background: #C0C0C0}' +
    '</style></head><body><div style="text-align: center; margin-top: 100px;' +
    'margin-bottom: 120px;">' + buttonHTML + '</div></body></html>')

  if (req.url.match(/suggest/)) {
    getRandomProject(function (title, description) {
      res.end('<div><div style="font-size: 60px; width: 800px; margin:0 auto;' +
        'text-align: center">' + title + '</div>' + '<div style=' +
        '"margin:0 auto; margin-top: 40px; width: 800px; font-size: 25px;' +
        'text-align:justify">' + description + '</div></div>')
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
