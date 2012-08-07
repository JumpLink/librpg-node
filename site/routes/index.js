
/*
 * GET home page.
 */
var Showdown = require('showdown');
var converter = new Showdown.converter();
var fetchUrl = require("fetch").fetchUrl;

function get_readme(return_readme) {
  fetchUrl("https://raw.github.com/JumpLink/HMWorld/master/README.md", function(error, meta, body){
    cb(converter.makeHtml(body.toString()));
  });
}

function return_readme(html) {
  return html;
}


exports.index = function(req, res){
  fetchUrl("https://raw.github.com/JumpLink/HMWorld/master/README.md", function(error, meta, body){
    var readme = converter.makeHtml(body.toString());
    res.render('index', {
      title: 'HMWorld',
      readme:readme
    });
  });
};