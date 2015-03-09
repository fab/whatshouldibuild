var request = require('request')
  , cheerio = require('cheerio')
  , http    = require('http')
  , ejs     = require('ejs')
  , fs      = require('fs')
  , path    = require('path')
  , mime    = require('mime')
  , url     = require('url')

var projectsURL = 'https://github.com/karan/Projects/blob/86c69ddca9db6b12c685f2334830090845789a24/README-scratch.md'
  , projectsHTML

request(projectsURL, function (err, res, body) {
  projectsHTML = body
})

var Application = function (req, res) {
  this.req = req
  this.res = res
  this.staticPages = {
    index : path.join(__dirname, 'public', 'index.html')
  }
  this.templates = {
    suggest : path.join(__dirname, 'public', 'project.ejs')
  }
}

Application.prototype.serveStatic = function (localPath, mimeType) {
  var self = this
  fs.readFile(localPath, 'utf-8', function (err, contents) {
    self.throwOnError(err)
    var mimeType = !mimeType ? mime.lookup(localPath) : mimeType
    self.res.writeHead(200, { "Content-Type" : mimeType })
    self.res.end(contents)
  })
}

Application.prototype.serveTemplate = function (templateName, templateData) {
  var self = this
  var templatePath = self.templates[templateName]
  fs.readFile(templatePath, 'utf-8', function (err, template) {
    self.throwOnError(err)
    var html = ejs.render(template, templateData)
    self.res.writeHead(200, { "Content-Type" : "text/html" })
    self.res.end(html)
  })
}

Application.prototype.getRandomProject = function (callback) {
  $ = cheerio.load(projectsHTML)
  var projects = $('.markdown-body p')
    , randNum = Math.floor(Math.random() * projects.length)
    , project = $(projects)[randNum]
    , title = $(project).find('strong').text()
    , description = $(project).text().slice(title.length + 3)

  callback(title, description)
}

Application.prototype.throwOnError = function (err) {
  if (err) {
    throw err
  }
}

var server = http.createServer(function (req, res) {
  var app = new Application(req, res)

  var urlPathName = url.parse(req.url).pathname
  var localPath = path.join(__dirname, 'public', urlPathName)

  fs.stat(localPath, function (err, stats) {
    var fileExists = !err && stats.isFile()
    if (fileExists) {
      app.serveStatic(localPath)
    } else {
      switch (urlPathName) {
        case '':
        case '/':
          app.serveStatic(app.staticPages.index)
          break
        case '/suggest':
          app.getRandomProject(function (title, description) {
            var templateData = { title : title , description : description }
            app.serveTemplate('suggest', templateData)
          })
          break
        default:
          res.writeHead(404, { "Content-Type" : "text/plain" })
          res.end('Not Found')
      }
    }
  })
})

var port = process.env.PORT || 8000

server.listen(port, function () {
  console.log('Listening on port ' + port)
})
