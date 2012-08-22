function loadCanvas(area_l) {
	var context = [area_l.to - area_l.from];
	var canvas = [area_l.to - area_l.from];
	for(var l=area_l.from;l<area_l.to;l++) {
		canvas[l] = document.getElementById('canvas_'+l);
		context[l] = canvas[l].getContext('2d');
	}
	return {context:context,canvas:canvas};
}

function drawTiles(map_id, area_l, area_x, area_y) {
	function draw(){
		for(var l=area_l.from;l<area_l.to;l++) {
			for(var y=area_y.from;y<area_y.to;y++) {
				for(var x=area_x.from;x<area_x.to;x++) {
					if(tiles[map_id][l][x][y].sx >= 0 && tiles[map_id][l][x][y].sy >= 0)
						canvas.context[l].drawImage(tilesets[map_id][tiles[map_id][l][x][y].ts_id], tiles[map_id][l][x][y].sx, tiles[map_id][l][x][y].sy, tilewidth[map_id], tileheight[map_id], tiles[map_id][l][x][y].dx, tiles[map_id][l][x][y].dy, tilewidth[map_id], tileheight[map_id]);
				}
			}
		}
	}
	tilesets[map_id][0].onload=draw;
	window.onload=draw;
}

/* on client */
if(typeof exports == 'undefined'){
  //nothing
} else { //son server
  module.exports.loadCanvas = loadCanvas;
  module.exports.drawTiles = drawTiles;
}