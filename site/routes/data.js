var Png = require('png').Png;

//fs.writeFileSync('./png.png', png_image.toString('binary'), 'binary');

module.exports = function (data, Hmwd) {

	function tile(req, res){

		var map = data.mapmanager.getFromFilename("testmap.tmx");
		var tile = map.getLayerFromName("under hero 1").getTileXY(req.params.x,req.params.y);

		var tilesetref = map.getTileSetRefFromGidFromOwn(tile.gid);
		var ts_id = map.getTileSetIndexFromGid(tile.gid);
		var id = tile.gid-tilesetref.firstgid;

		res.render('tile', {
			title: 'HMWorld - Tile',
			ts_id : ts_id,
			id: id
		}); 
	}

	function getMapTiles(map, area_l, area_x, area_y) {
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

	function map(req, res){

		var map = data.mapmanager.getFromFilename(req.params.name);

		res.render('map', {
			title: 'HMWorld - Map '+req.params.name,
			tiles : getMapTiles(map, {from: 0, to: map.all_layer_size}, {from: 0, to: map.width},  {from: 0, to: map.height}),
			width: map.width,
			height: map.height,
			tilewidth: map.tilewidth,
			tileheight: map.tileheight
		}); 
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
			maps[i].nodejs_tiles = getMapTiles(maps[i], {from: 0, to: maps[i].all_layer_size}, {from: 0, to: width}, {from: 0, to: height})
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
			spritesets[i].name = "test "+i;
		}
		console.log("spritesetmanager.length "+ spritesetmanager.size);
		res.render('spriteset_index', {
			title: 'HMWorld - SpriteSet Index',
			spritesets : spritesets,
		}); 
	}

	return {
		tile : tile,
		map : map,
		map_index : map_index,
		tileset_index: tileset_index,
		spriteset_index: spriteset_index
	}
}

