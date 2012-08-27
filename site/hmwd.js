var form2json = require('form2json')
  , Gir = require('gir')
  , Hmwd_gir = module.exports = Gir.load('Hmwd')
  , data = new Hmwd_gir.Data()
  , css = require('./css.js')(data)
  , Canvas = require('canvas')
  , Image = Canvas.Image
  , fs = require('fs')
  , nodejs_maps = []
  , nodejs_sprites =[]
  ;
//var HmwdCanvas = require(__dirname+'/public/javascripts/canvas.js');


function init() {
	data.loadTileSetManager(__dirname+"/public/data/tileset/");
	data.loadMapManager(__dirname+"/public/data/map/");
	data.loadSpriteSetManager(__dirname+"/public/data/spriteset/");
	css.generateTileCss();
	css.generateTileSetCss();
	parseAllMapsForNodejs();
	parseAllSpritesForNodejs();
}

function getPngBuffer(tex){
	var png_nodejs = [tex.png_length];
	for (var i = 0; i < tex.png_length; i++) {
		png_nodejs[i] = tex.get_pngbuffer_from_index(i);
	};
	var buf = new Buffer(png_nodejs);
	return buf;
}

function getObjectAsJsonString(object) {
	return JSON.stringify(form2json.transform(object))
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
		var tiles = [area_x.to-area_x.from];
		for(var x=area_x.from;x<area_x.to;x++) {
			tiles[x] = [area_y.to-area_y.from];
			for(var y=area_y.from;y<area_y.to;y++) {
				tiles[x][y] = {
					sx: map.getTileImageXCoordFromPosition(x,y,l)-map.tilewidth, //TODO minus hier oder lieber im vala-code?
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

function getMapTileImageCoordAsJsonString(map, area_l, area_x, area_y) {
	var tiles = getMapTileImageCoord(map, area_l, area_x, area_y);
	return getObjectAsJsonString(tiles);
}

function parseAllMapsForNodejs() {
	//nodejs_maps = [data.mapmanager.length]; //TODO dosn't work, why?
	//console.log("data.mapmanager.length:"+data.mapmanager.length);
	for (var i = 0; i < data.mapmanager.length; i++) {
		var tmp_map = data.mapmanager.getMapFromIndex(i);
		//console.log("tmp_map.filename:"+tmp_map.filename);
		nodejs_map = {
			filename: tmp_map.filename,
			version:  tmp_map.version,
			orientation: tmp_map.orientation,
			width : tmp_map.width,
			height : tmp_map.height,
			tiles: getMapTileImageCoordAsJsonString(tmp_map, {from: 0, to: tmp_map.all_layer_size}, {from: 0, to: tmp_map.width},  {from: 0, to: tmp_map.height}),
			pxl_width:tmp_map.pxl_width,
			pxl_height:tmp_map.pxl_height,
			tilesets: getTileSetImagenamesForIDs(tmp_map),
			area_l: getObjectAsJsonString({from: 0, to: tmp_map.all_layer_size}),
			area_x: getObjectAsJsonString({from: 0, to: tmp_map.width}),
			area_y: getObjectAsJsonString({from: 0, to: tmp_map.height}),
			tilewidth:tmp_map.tilewidth,
			tileheight:tmp_map.tileheight,
			download_url : "/data/map/"+data.mapmanager.getMapFilenameFromIndex(i),
			description : "This is a simple test map to test our game engine.", //TOTO move to Hmwd
			name : "Test Map", //TOTO move to Hmwd
			author : "Pascal Garber", //TOTO move to Hmwd
		};
		if(nodejs_map.filename == 'testmap.tmx') { //TODO with iriscouch.com
			nodejs_map.activityId = 'z13fglp41ov0wpqkw22sc3booyj2v54hg04';
			nodejs_map.gplus_link = 'https://plus.google.com/b/113975431121027814056/113975431121027814056/posts/5oW2JMxYXCR';
		}
		generateMapThumbnail(nodejs_map);
		nodejs_maps[i]=nodejs_map;
	};
}



function generateMapThumbnail(map) {
	var area_l = JSON.parse(map.area_l);
	var area_x = {from: 0, to: 23};
	var area_y = {from: 0, to: 15};
	var tilesets = [map.tilesets.length];
	var tiles = JSON.parse(map.tiles);
	var width = (area_x.to - area_x.from)*map.tilewidth;
	var height = (area_y.to - area_y.from)*map.tileheight;
	var canvas = new Canvas(360, height);
	var context = canvas.getContext('2d');
	//console.log("tiles");
	//console.log(tiles);
	for(var t=0;t<map.tilesets.length;t++){
		tilesets[t] = new Image;
		tilesets[t].src = fs.readFileSync(__dirname + '/public/data/tileset/'+map.tilesets[t]);
	}
	//console.log("tilesets");
	//console.log(tilesets);
	for(var l=area_l.from;l<area_l.to;l++) {
		for(var y=area_y.from;y<area_y.to;y++) {
			for(var x=area_x.from;x<area_x.to;x++) {
				if(tiles[l][x][y].sx >= 0 && tiles[l][x][y].sy >= 0)
					context.drawImage(tilesets[tiles[l][x][y].ts_id], tiles[l][x][y].sx, tiles[l][x][y].sy, map.tilewidth, map.tileheight, tiles[l][x][y].dx, tiles[l][x][y].dy, map.tilewidth, map.tileheight);
			}
		}
	}
	context.fillStyle = 'rgba(0,0,0,0.5)';
	context.fillRect(0,0,width,30); //black transparent box on top
	context.fillRect(0,height-30,width,height);  //black transparent box on bottom

	context.fillStyle = 'white';
	context.font = 'bold 14px "Ubuntu Beta", UbuntuBeta, Ubuntu, "Bitstream Vera Sans", "DejaVu Sans", Tahoma, sans-serif';
	context.fillText(map.filename+" - "+map.name, 5, 20);	//left text for box on top

	context.font = 'normal 12px "Ubuntu Beta", UbuntuBeta, Ubuntu, "Bitstream Vera Sans", "DejaVu Sans", Tahoma, sans-serif';
	context.fillText(map.width+" × "+map.height+" tiles", width-95, 20); //right text for box on top
	context.fillText(map.author, 5, height-12); //left text for box on bottom

	var out = fs.createWriteStream(__dirname +'/public/data/map/thumb_'+ map.filename+".png")
	  , stream = canvas.createPNGStream();

	stream.on('data', function(chunk){
	  out.write(chunk);
	});
}

function load_animations(ani, width, height) {
	var animation = [];
	//console.log("animationdata.size: "+ani.size);
	//console.log("width: "+width);
	//console.log("height: "+height);
	for (var i = 0; i < ani.size; i++) {
		//TODO repeat or not?
		//console.log(ani.get_AnimationData().to_string_for_split('|'));
		animation[i] = ani.get_AnimationData().to_string_for_split('|').split('|');
		animation[i][0]*=width;
		animation[i][1]*=height;
		ani.time();
		//console.log(animation[i]);
	};
	return animation;
}

function parseAllSpritesForNodejs() {
	//nodejs_sprites = [data.spritesetmanager.size];
	var spritesetmanager = data.spritesetmanager;
	var spritesets = [];

	for(var i=0;i<spritesetmanager.size;i++) {
		spritesets[i] = spritesetmanager.getFromIndex(i);
		spritesets[i].set_Animation_from_string("go","south");
		spritesets[i].url = "/data/spriteset/"+spritesets[i].filename.replace(new RegExp(" ","g"), '%20');
		spritesets[i].description = "This is a test spriteset to test this site."; //TOTO move to Hmwd
		spritesets[i].author = "Pascal Garber"; //TOTO move to Hmwd
		spritesets[i].name = "test "+i; //TODO1 i = 1, move to Hmwd
		var nodejs_sprite = {
			spriteset : spritesets[i],
			animation : getObjectAsJsonString(load_animations(spritesets[i].current_animation, spritesets[i].spritewidth, spritesets[i].spriteheight))
		}
		nodejs_sprites[i] = nodejs_sprite;
	}
}

function getNodejsMapFromFilename(filename) {
	for (var i = 0; i < data.mapmanager.length; i++) {
		if (nodejs_maps[i].filename == filename)
			return nodejs_maps[i];
	}
	return null;
}
	

module.exports = {
	getMapTileSetSources: getMapTileSetSources,
	getTileSetImagenamesForIDs: getTileSetImagenamesForIDs,
	getMapTileImageCoord: getMapTileImageCoord,
	getMapTileIds: getMapTileIds,
	getPngBuffer:getPngBuffer,
	getObjectAsJsonString:getObjectAsJsonString,
	init:init,
	data:data,
	nodejs_maps:nodejs_maps,
	nodejs_sprites:nodejs_sprites,
	getNodejsMapFromFilename:getNodejsMapFromFilename
	//getMapInfo:getMapInfo
}