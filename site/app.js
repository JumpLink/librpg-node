/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , hmwd = require('./hmwd.js')
  , conf = require('./config/config.js')
  ;

hmwd.init();

var data_route = require('./routes/data.js')(hmwd);
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
app.get('/maptest', data_route.map_test);
app.get('/map/:name', data_route.map_info);
app.get('/map/full/:name', data_route.map);
app.get('/map/:mapname/layername/:layername/tile/:x/:y', data_route.maptile);
app.get('/tileset', data_route.tileset_index);
app.get('/tilesetid/:id', data_route.tileset_id);
app.get('/spriteset', data_route.spriteset_index);
app.get('/dialog', routes.work);
app.get('/dev', routes.work);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
