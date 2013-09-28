var BufferedReader = require("buffered-reader");
var DataReader = BufferedReader.DataReader;
var fs = require('fs');
var databaseUrl = "test";
var collections = [ "users", "tempresults" ];

var files = [];
var dateList = [ "080327" ];
var db = require("mongojs").connect(databaseUrl, collections);

var TOTAL_LINES = 40780;
var numLines = 0;
var strs = [ "id,uploader,age,category,length,views,comments,ratings,uploads,friends,related_ratings\n" ];

function dropCollection() {
	db.videos.drop();
}

function generateFiles() {
	for ( var i = 0; i < dateList.length; i++) {
		for ( var j = 0; j < 3; j++) {
			var file = "./Youtube_Data/Video_Data/" + dateList[i] + "/"
					+ dateList[i] + "/" + j + ".txt";
			files.push(file);
		}
	}
}

function readFiles() {
	for ( var i = 0; i < files.length; i++) {
		new DataReader(files[i], {
			encoding : "utf8"
		}).on("error", function(error) {
			console.log(error);
		}).on("line", function(line) {
			processLine(line);
			numLines++;
			if (numLines === TOTAL_LINES) {
				var str = "";
				for ( var i = 0; i < strs.length; i++) {
					str += strs[i];
				}
				fs.writeFile("./test.txt", str, function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		}).on("end", function() {
			console.log("EOF");
			console.log(numLines);
		}).read();
	}
}

function processLine(line) {
	var fields = line.split("\t"); /* split the line with tabs */

	var _id = fields[0];
	var uploader = fields[1];
	var age = fields[2] ? parseInt(fields[2]) : 0;
	var category = fields[3];
	var length = fields[4] ? parseInt(fields[4]) : 0;
	var views = fields[5] ? parseInt(fields[5]) : 0;
	var rate = fields[6] ? parseFloat(fields[6]) : 0;
	var ratings = fields[7] ? parseInt(fields[7]) : 0;
	var comments = fields[8] ? parseInt(fields[8]) : 0;

	var relatedVideos = fields.slice(9, fields.length);

	db.users.find({
		_id : uploader
	}).forEach(processUsers);
}

function processUsers(err, _doc) {
	if (err) {
		console.log(err);
	}
	if (_doc) {

		var uploads = _doc.uploads;
		var friends = _doc.friends;

		db.tempresults.find({
			_id : _id
		}).forEach(processTempResults);
	}
}

function processTempResults(_err, _doc) {
	if (_err) {
		console.log(_err);
	}
	if (_doc_) {
		// console.log("here");
		var avg = _doc_.avg;

		if (age !== 0 && ratings !== 0 && avg !== 0 && comments !== 0
				&& views !== 0 && friends !== 0 && uploads !== 0
				&& length !== 0) {
			var _str = "" + _id + "," + uploader + "," + age + "," + category
					+ "," + length + "," + views + "," + comments + ","
					+ ratings + "," + uploads + "," + friends + "," + avg
					+ "\n";
			if (_str.indexOf('NaN') === -1 && _str.indexOf('undefined') === -1) {
				strs.push(_str);
			}
		}
	}
}

(function() {
	generateFiles();
	readFiles();
})();