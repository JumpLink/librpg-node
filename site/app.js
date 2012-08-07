
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var Gir = require('gir');
var Hmwd = module.exports = Gir.load('Hmwd');
var data = new Hmwd.Data();
data.loadTileSetManager("./public/data/tileset/");
data.loadMapManager("./public/data/map/");
//data.loadSpriteSetManager("./public/data/spriteset/");

var css = require('./css.js')(data);
css.generateTileCss();
css.generateTileSetCss();

var data_route = require('./routes/data.js')(data, Hmwd);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/map/:name', data_route.map);
app.get('/spritesets', routes.index);
app.get('/tilesets', routes.index);
app.get('/dialogs', routes.index);
app.get('/dev', routes.index);
app.get('/tile/:x/:y', data_route.tile);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
