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
			map : hmwd.getNodejsMapFromFilename(req.params.name)
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

		var tilesetmanager = hmwd.data.tilesetmanager;
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

		var spritesetmanager = hmwd.data.spritesetmanager;
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
		map_info : map_info,
		tileset_index: tileset_index,
		spriteset_index: spriteset_index,
		maptile:maptile,
		tileset_id:tileset_id
	}
}

