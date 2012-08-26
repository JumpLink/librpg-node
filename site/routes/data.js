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
		var animations = [];
		function load_animations(ani, width, height) {
			var animation = [];
			console.log("animationdata.size: "+ani.size);
			console.log("width: "+width);
			console.log("height: "+height);
			for (var i = 0; i < ani.size; i++) {
				//TODO repeat or not?
				console.log(ani.get_AnimationData().to_string_for_split('|'));
				animation[i] = ani.get_AnimationData().to_string_for_split('|').split('|');
				animation[i][0]*=width;
				animation[i][1]*=height;
				ani.time();
				console.log(animation[i]);
			};
			return animation;
		}
		//var image_filename = [];
		for(var i=0;i<spritesetmanager.size;i++) {
			spritesets[i] = spritesetmanager.getFromIndex(i);
			spritesets[i].set_Animation_from_string("go","south");
			//console.log(spritesets[i].name);
			spritesets[i].url = "/data/spriteset/"+spritesets[i].filename.replace(new RegExp(" ","g"), '%20');
			spritesets[i].description = "This is a test spriteset to test this site."; //TOTO move to Hmwd
			spritesets[i].author = "Pascal Garber"; //TOTO move to Hmwd
			spritesets[i].name = "test "+i; //TODO1 i = 1, move to Hmwd
			animations[i] = load_animations(spritesets[i].current_animation, spritesets[i].spritewidth, spritesets[i].spriteheight);
			//animations[i] = spritesets[i].current_animation.get_AnimationData().to_string_for_split('|');
			//console.log(animations[i]);
			//animations[i] = animations[i].split('|');
			//console.log(animations[i]);
			
			//image_filename[i] = spritesets[i].get_baseLayer().image_filename;
			//spritesets[i].current_animation.get_AnimationData().to_string_for_split('|')
		}
		//console.log("spritesetmanager.length "+ spritesetmanager.size);
		res.render('spriteset_index', {
			title: 'HMWorld - SpriteSet Index',
			spritesets : spritesets,
			animations : hmwd.getObjectAsJsonString(animations)
			//image_filename : image_filename,
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

