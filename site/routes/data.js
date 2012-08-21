module.exports = function (hmwd) {

	function map(req, res){
		maps = [1];
		maps[0] =  hmwd.getNodejsMapFromFilename(req.params.name);
		res.render('map', {
			title: 'HMWorld - Map '+req.params.name,
			maps :maps,
			tilewidth : 16, //TODO
			tileheight : 16 //TODO
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
			maps : hmwd.nodejs_maps,
			tilewidth : 16, //TODO
			tileheight : 16, //TODO
			area_x: {from: 0, to: 20},
			area_y: {from: 0, to: 15},
		}); 
	}
	function map_test(req, res){
		var tex = hmwd.data.mapmanager.getFromFilename("testmap.tmx").getLayerFromName("under hero 1").getTileXY(0,0).tex;

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
		tileset_index: tileset_index,
		spriteset_index: spriteset_index,
		map_test:map_test,
		maptile:maptile,
		tileset_id:tileset_id
	}
}

