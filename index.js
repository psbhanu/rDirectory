var fs = require('fs');
var sizeUnits = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
module.exports = function(){
	var read = function( file ) {
		depth = 0;
		fs.stat(file, function(error, stats){
			if( error ){
				console.error(error);
			} else {
				if(stats.isFile()){
					console.log(file);
				} else if(stats.isDirectory()){
					console.log("[" + file + "]");
					listFiles(file, file, depth);
				}
			}
		});
	};
	
	var listFiles = function( path, directory, depth ) {
		depth ++;
		var depthSpace = '';
		var type = '';
		var size = 0;
		for( i = depth; i > 0; i--){
			depthSpace += '  ';
		} 

		files = fs.readdirSync(path);
		files.forEach(function(file){
			var newPath = path + '/' + file;
			stats = fs.statSync(newPath);
			if(stats.isFile()){
				type = 'FILE';
				fileSize = getSize( stats.size, 0 );
				console.log( depthSpace + '|_' + file + ' [' + type + '  ' +  fileSize + '  ' + getDateTime(stats.ctime) + ']' );
			} else if(stats.isDirectory()){
				type = 'DIR';
			console.log( depthSpace + '|_' + file + ' [' + type +  '  ' + getDateTime(stats.ctime) + ']');
				listFiles(newPath, file, depth);
			}					
		});
	};
	function getSize( size,  sizeUnitsIndex) {
		size = parseFloat(size).toFixed(2)
		if( size > 1024 ) {
			size = getSize(size/1024, ++sizeUnitsIndex);
		} else {
			return size + ' ' + sizeUnits[sizeUnitsIndex];
		}
		return size;
	}
	function getDateTime(date) {
		var hour = date.getHours();
		hour = (hour < 10 ? "0" : "") + hour;

		var min  = date.getMinutes();
		min = (min < 10 ? "0" : "") + min;

		var sec  = date.getSeconds();
		sec = (sec < 10 ? "0" : "") + sec;

		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = date.getDate();
		day = (day < 10 ? "0" : "") + day;
		
		if( hour >= 12 ) {
			ampm = 'PM';
			hour = hour - 12;
		} else {
			ampm = 'AM';
		}
		
		//return year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;
		return day + "/" + month + "/" + year + " " + hour + ":" + min + ' ' + ampm;
	}	
	return {
		read : read
	}
}