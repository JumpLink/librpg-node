
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
    var readme;
    if(typeof(body)!=="undefined")
      readme = converter.makeHtml(body.toString());
    else
      readme = "coudn't load README.md";
    res.render('index', {
      title: 'HMWorld',
      readme:readme
    });
  });
};

exports.work = function(req, res){
  res.render('work', {
    title: 'HMWorld - work in progress'
  });
};