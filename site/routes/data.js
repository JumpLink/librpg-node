//var Png = require('png').Png;

//fs.writeFileSync('./png.png', png_image.toString('binary'), 'binary');
var form2json = require('form2json');

module.exports = function (data, Hmwd) {

	function getPngBuffer(tex){
		var png_nodejs = [tex.png_length];
		for (var i = 0; i < tex.png_length; i++) {
			png_nodejs[i] = tex.get_pngbuffer_from_index(i);
		};
		var buf = new Buffer(png_nodejs);
		return buf;
	}

	function getMapTileIds(map, area_l, area_x, area_y) {
		var layers = [];
		for(var l=area_l.from;l<area_l.to;l++) {
			var count = 0;
			var tiles = [];
			for(var y=area_y.from;y<area_y.to;y++) {
				for(var x=area_x.from;x<area_x.to;x++, count++) {
					tiles[count] = {
						t_id: map.getTileIDFromPosition(x,y,l),
						ts_id: map.getTileSetIndexFromPosition(x,y,l)
					}
				}
			}
			layers[l]=tiles;
		}
		return layers;
	}


	function getMapTileImageCoord(map, area_l, area_x, area_y) {
		var layers = [];
		for(var l=area_l.from;l<area_l.to;l++) {
			var count = 0;
			var tiles = [];
			for(var y=area_y.from;y<area_y.to;y++) {
				for(var x=area_x.from;x<area_x.to;x++, count++) {
					tiles[count] = {
						sx: map.getTileImageXCoordFromPosition(x,y,l)-map.tileheight, //TODO minus hier oder lieber im vala-code?
						sy: map.getTileImageYCoordFromPosition(x,y,l),
						ts_id: map.getTileSetIndexFromPosition(x,y,l),
						dx: x*map.tilewidth,
						dy: y*map.tileheight
					}
				}
			}
			layers[l]=tiles;
		}
		return layers;
	}

	function getTileSetImagenamesForIDs (map) {
		
		var tileset_imagenames = [map.tileset_size]
		for (var i = 0; i < map.tileset_size; i++) {
			tileset_imagenames[i] = map.getTileSetSourceFromIndex(i);
		}
		return tileset_imagenames;
	}

	function map(req, res){

		var map = data.mapmanager.getFromFilename(req.params.name);
		var tiles = getMapTileImageCoord(map, {from: 0, to: map.all_layer_size}, {from: 0, to: map.width},  {from: 0, to: map.height});

		res.render('map', {
			title: 'HMWorld - Map '+req.params.name,
			tiles : JSON.stringify(form2json.transform(tiles)),
			tilesets: getTileSetImagenamesForIDs(map),
			map : map
		}); 
	}

	function maptile(req, res){

		var map = data.mapmanager.getFromFilename(req.params.mapname);
		var tex = map.getLayerFromName(req.params.layername).getTileXY(req.params.x,req.params.y).tex;

		var buf = getPngBuffer(tex);
		
		res.type('png');
		res.send(buf);
	}

	function getMapTileSetSources(map) {
		var nodejs_tileset = {
			filename : [],
			url : []
		}
		//console.log("map.tileset_size "+map.tileset_size);
		for(var i=0;i<map.tileset_size;i++) {
			//console.log(map.getTileSetSourceFromIndex(i));
			nodejs_tileset.filename[i] = map.getTileSetSourceFromIndex(i);
			//nodejs_tileset.url[i] = "/tileset#" + nodejs_tileset.filename[i].replace(new RegExp(" ","g"), '%20');
			nodejs_tileset.url[i] = "/tileset#" + nodejs_tileset.filename[i];
		}
		return nodejs_tileset;
	}

	function map_index(req, res){

		var mapmanager = data.mapmanager;
		var width = 20;
		var height = 15;
		var maps = [];
		for(var i=0;i<mapmanager.size;i++) {
			maps[i] = mapmanager.getMapFromIndex(i);
			maps[i].download_url = "/data/map/"+maps[i].filename;
			maps[i].nodejs_tiles = getMapTileIds(maps[i], {from: 0, to: maps[i].all_layer_size}, {from: 0, to: width}, {from: 0, to: height})
			maps[i].description = "This is a simle test map to test our game engine."; //TOTO move to Hmwd
			maps[i].name = "Test Map"; //TOTO move to Hmwd
			maps[i].author = "Pascal Garber"; //TOTO move to Hmwd
			maps[i].nodejs_tileset = getMapTileSetSources(maps[i]);
		}

		res.render('map_index', {
			title: 'HMWorld - Map Index',
			maps : maps,
			width: width,
			height: height
		}); 
	}
	function map_test(req, res){
		var tex = data.mapmanager.getFromFilename("testmap.tmx").getLayerFromName("under hero 1").getTileXY(0,0).tex;

		var png_buffer_nodejs = [tex.png_length];
		//console.log("png_length: "+tex.png_length);
		for (var i = 0; i < tex.png_length; i++) {
			png_buffer_nodejs[i] = tex.get_pngbuffer_from_index(i);
		};
		var buf = new Buffer(png_buffer_nodejs);
		res.type('png');
		res.send(buf);
	}


	function tileset_id(req, res){
		var tilesetmanager = data.tilesetmanager;
		if(req.params.id < tilesetmanager.size) {
			var tileset = tilesetmanager.getFromIndex(req.params.id);
			var filename = tileset.source;
			var url = "/data/tileset/"+filename;
			res.sendfile(url, {root: __dirname+"/../public"});
		} else {
			res.send(403, 'Sorry! Can not find tileset id');
		}

	}

	function tileset_index(req, res){

		var tilesetmanager = data.tilesetmanager;
		var tilesets = [];
		for(var i=0;i<tilesetmanager.size;i++) {
			tilesets[i] = tilesetmanager.getFromIndex(i);
			tilesets[i].url = "/data/tileset/"+tilesets[i].source.replace(new RegExp(" ","g"), '%20');
			tilesets[i].description = "This is a test tileset to test this site."; //TOTO move to Hmwd
			tilesets[i].name = "Test TileSet"; //TOTO move to Hmwd
			tilesets[i].author = "Pascal Garber"; //TOTO move to Hmwd
		}

		res.render('tileset_index', {
			title: 'HMWorld - TileSet Index',
			tilesets : tilesets,
		}); 
	}

	function spriteset_index(req, res){

		var spritesetmanager = data.spritesetmanager;
		var spritesets = [];
		for(var i=0;i<spritesetmanager.size;i++) {
			spritesets[i] = spritesetmanager.getFromIndex(i);
			console.log(spritesets[i].name);
			spritesets[i].url = "/data/spriteset/"+spritesets[i].filename.replace(new RegExp(" ","g"), '%20');
			spritesets[i].description = "This is a test spriteset to test this site."; //TOTO move to Hmwd
			spritesets[i].author = "Pascal Garber"; //TOTO move to Hmwd
			spritesets[i].name = "test "+i; //TODO1 i = 1, move to Hmwd
		}
		console.log("spritesetmanager.length "+ spritesetmanager.size);
		res.render('spriteset_index', {
			title: 'HMWorld - SpriteSet Index',
			spritesets : spritesets,
		}); 
	}

	return {
		map : map,
		map_index : map_index,
		tileset_index: tileset_index,
		spriteset_index: spriteset_index,
		map_test:map_test,
		maptile:maptile,
		tileset_id:tileset_id
	}
}

