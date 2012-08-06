var Png = require('png').Png;

//fs.writeFileSync('./png.png', png_image.toString('binary'), 'binary');

module.exports = function (data, Hmwd) {

	function tile(req, res){
		//res.set('Content-Type', 'image/png');
		res.type('png');
		//res.send(data.mapmanager.getFromFilename("testmap.tmx").getLayerFromName("under hero 1").getTileXY(req.params.x,req.params.y).tex.save_to_buffer("png"));
		var tex = data.mapmanager.getFromFilename("testmap.tmx").getLayerFromName("under hero 1").getTileXY(req.params.x,req.params.y).tex;
		//var str_buf = tex.save_to_buffer("png");
		//console.log(tex.string_pixels);
		//var pixels = tex.copy_pixels();
		console.log();
		//console.log("pixel size: " +tex.length+" (nodejs)");
		//console.log(); console.log(); console.log();
		

		var pixel = [];

		var rgba = new Buffer(tex.length);


		for (var i = 0; i < tex.length; i++) {
			rgba[i] = tex.copy_pixel(i);
			process.stdout.write(rgba[i]+" ");
		};

		//console.log(typeof(pixel[3]));

		//var pixbuf = new Buffer(pixel, 'binary');
		//var image = new Buffer(tex.save_to_buffer_string("png"), 'utf8');
		// var pixel_buf = new Buffer(tex.string_pixels, 'utf8');
		var png = new Png(rgba, tex.width, tex.height, 'rgba');
		var png_image = png.encodeSync();
		// tex.save("./"+req.params.x+"-"+req.params.y+".png");
		// console.log(typeof(png_image));

		res.send(png_image);

	}

	return {
		tile : tile
	}
}

