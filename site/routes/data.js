var conf = require(__dirname+'/../config/config.js');
module.exports = function (hmwd) {

	function map(req, res){
		var maps = [1];
		maps[0] =  hmwd.getNodejsMapFromFilename(req.params.name);
		res.render('map', {
			title: 'HMWorld - Map '+req.params.name,
			maps :maps
		}); 
	}

	function map_info(req, res){
		var map = hmwd.getNodejsMapFromFilename(req.params.name);
		res.render('map_info', {
			title: 'HMWorld - Map Info '+map.name,
			map : hmwd.getNodejsMapFromFilename(req.params.name),
			key: conf.google.key
		}); 
	}

	function maptile(req, res){

		var map = hmwd.data.mapmanager.getFromFilename(req.params.mapname);
		var tex = map.getLayerFromName(req.params.layername).getTileXY(req.params.x,req.params.y).tex;

		var buf = hmwd.getPngBuffer(tex);
		
		res.type('png');
		res.send(buf);
	}

	function map_index(req, res){
		res.render('map_index', {
			title: 'HMWorld - Map Index',
			maps : hmwd.nodejs_maps
		}); 
	}

	function tileset_id(req, res){
		var tilesetmanager = hmwd.data.tilesetmanager;
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
		res.render('tileset_index', {
			title: 'HMWorld - TileSet Index',
			tilesets : hmwd.nodejs_tilesets
		}); 
	}

	function spriteset_index(req, res){
		res.render('spriteset_index', {
			title: 'HMWorld - SpriteSet Index',
			sprites : hmwd.nodejs_sprites
		}); 
	}

	function spriteset_layer(req, res){
		var spritesetmanager = hmwd.data.spritesetmanager;
		var spriteset = spritesetmanager.getFromFilename(req.params.spriteset_name);
		var filename =  spriteset.get_spritelayers_from_index(req.params.layer_index).image_filename;
		var url = "/data/spriteset/"+filename;
		res.sendfile(url, {root: __dirname+"/../public"});
	}
	return {
		map : map,
		map_index : map_index,
		map_info : map_info,
		tileset_index: tileset_index,
		spriteset_index: spriteset_index,
		maptile:maptile,
		tileset_id:tileset_id,
		spriteset_layer:spriteset_layer
	}
}

