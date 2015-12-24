var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);

var Twitter = require('twitter');
var dotenv = require('dotenv');

var env = {};
var pictureUrls = [];
var tweetTexts = [];

// loads .env into process.env
dotenv.load();
env = process.env;

var port = Number(process.env.PORT || 5000);

app.use("/public", express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));
//app.use("/fonts", express.static(__dirname + '/../public/fonts'));

server.listen(port, function() {
   console.log("Listenin\' on " + port);
});


app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index3.html');
});

app.get('/tweets', function(req, res){
	console.log('/tweets request receieved!');
	res.json({
		urls: pictureUrls,
		plaintext: tweetTexts
	});
});

// connect to twitter with credentials from /.env
client = new Twitter({
    consumer_key: env.T_CONSUMER_KEY,
    consumer_secret: env.T_CONSUMER_SECRET,
    access_token_key: env.T_TOKEN,
    access_token_secret: env.T_TOKEN_SECRET
 });

// catch all new tweets
client.stream('statuses/filter', {track: 'katestraveldiaries'}, function (stream) {

  stream.on('error', function (err) {
  	console.log('Oh no, there was an error!', err);
  });

  stream.on('data', function (data) {
  	console.log('tweet caught! ', data.text);
  	addTweetPhoto(data);
  });

});

// search twitter for all uses of the hashtag
client.get('search/tweets', {q: '#katestraveldiaries'}, function(err, tweets, response){
	//console.log('resp: ', response);
	//console.log('search response: ', tweets);
	//console.log('first media url: ', tweets.statuses[0].entities.media[0].media_url_https);

	for(var i = 0; i < tweets.statuses.length; i++){
		var status = tweets.statuses[i];
		addTweetPhoto(status);
	}

		console.log('photo urls:', pictureUrls);
});


// grab the first media url and return it
function addTweetPhoto(status){
	if(status.entities.hasOwnProperty('media')){
		if(typeof(status.entities.media) == 'object'){
			var media = status.entities.media;
			//console.log(media);
			var url = media[0].media_url_https;
			pictureUrls.push(url);
		}
	}

	// add text of tweets to an array
	tweetTexts.push(status.text);
}
