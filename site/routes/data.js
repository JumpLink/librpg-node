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

	function map(req, res){

		var map = data.mapmanager.getFromFilename(req.params.name);
		var tiles = [];
		var layers = [];
		console.log("all_layer_size: "+map.all_layer_size);
		//for(var l=0;l<map.all_layer_size;l++) {
		var l = 0;
			var count = 0;
			for(var y=0;y<map.height;y++) {
				for(var x=0;x<map.width;x++, count++) {
					tiles[count] = {
						t_id: map.getTileIDFromPosition(x,y,l),
						ts_id: map.getTileSetIndexFromPosition(x,y,l)
					}
				}
			}
			layers[l]=tiles;
		//}
		console.log("layers: "+layers.length);

		res.render('map', {
			title: 'HMWorld - Map',
			tiles : tiles,
			width: map.width,
			height: map.height,
			tilewidth: map.tilewidth,
			tileheight: map.tileheight
		}); 
	}

	return {
		tile : tile,
		map : map
	}
}

