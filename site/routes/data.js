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
		}

		res.render('map_index', {
			title: 'HMWorld - Map Index',
			maps : maps,
			width: width,
			height: height
		}); 
	}

	return {
		tile : tile,
		map : map,
		map_index : map_index
	}
}

