process.env.LD_LIBRARY_PATH = __dirname+"/lib/";
process.env.GI_TYPELIB_PATH = __dirname+"/lib/";
process.env.DYLD_LIBRARY_PATH = __dirname+"/lib/";
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
data.loadTileSetManager(__dirname+"/public/data/tileset/");
data.loadMapManager(__dirname+"/public/data/map/");
data.loadSpriteSetManager(__dirname+"/public/data/spriteset/");

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
app.get('/map', data_route.map_index);
app.get('/map/:name', data_route.map);
app.get('/map/:name/tile/:x/:y', data_route.tile);
app.get('/tileset', data_route.tileset_index);
app.get('/spriteset', data_route.spriteset_index);
app.get('/dialog', routes.work);
app.get('/dev', routes.work);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
