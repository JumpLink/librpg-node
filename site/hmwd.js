var form2json = require('form2json');
var Gir = require('gir');
var Hmwd_gir = module.exports = Gir.load('Hmwd');
var data = new Hmwd_gir.Data();
var css = require('./css.js')(data);

var nodejs_maps = [];

function init() {
	data.loadTileSetManager(__dirname+"/public/data/tileset/");
	data.loadMapManager(__dirname+"/public/data/map/");
	data.loadSpriteSetManager(__dirname+"/public/data/spriteset/");
	css.generateTileCss();
	css.generateTileSetCss();
	parseAllMapsForNodejs();
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

// function getMapInfo() { //TODO not work
// 	var tilewidth = data.mapmanager.getMapFromIndex(0).tilewidth;
// 	var tileheight = data.mapmanager.getMapFromIndex(0).tileheight;

// 	var mapinfo = {
// 		tilewidth : tilewidth,
// 		tileheight : tileheight
// 	}
// 	return mapinfo;
// }

function parseAllMapsForNodejs() {
	for (var i = 0; i < data.mapmanager.length; i++) {
		var tmp_map = data.mapmanager.getMapFromIndex(i);
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
			//nodejs_tiles : hmwd.getMapTileIds(maps[i], {from: 0, to: maps[i].all_layer_size}, {from: 0, to: width}, {from: 0, to: height}),
			description : "This is a simple test map to test our game engine.", //TOTO move to Hmwd
			name : "Test Map", //TOTO move to Hmwd
			author : "Pascal Garber", //TOTO move to Hmwd
		};
		nodejs_maps[i]=nodejs_map;
	};
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
	getNodejsMapFromFilename:getNodejsMapFromFilename
	//getMapInfo:getMapInfo
}