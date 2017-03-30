var express = require('express');
var cheerio = require('cheerio');
//var iconv = require('iconv-lite')  
var superagent = require('superagent');

var app = express();

app.get('/', function (req, res, next) {
  superagent.get('http://www.barretlee.com/entry/')
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }
      var $ = cheerio.load(sres.text, {decodeEntities: false});
      var items = [];
      var host = sres.req.socket._host;
      $('.entry-recent-posts li').each(function (idx, element) {
        var $element = $(element);
        var $spanDom = $(element).find('span').first();
        var $aDom = $(element).find('a');
        
        items.push({
          time: $spanDom.html(),
          title: $aDom.html(),
          href: host + $aDom.attr('href'),
        });
      });

      res.send(items);
    });
});


app.listen(3000, function () {
  console.log('app is listening at port 3000');
});