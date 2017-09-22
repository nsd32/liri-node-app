
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');

var command = process.argv[2];

myTweets = () => {
	// having keys in same file
	var client = new Twitter ({
	  consumer_key: 'sspPzyj3sEiVW8QeE05MTxjsU',
	  consumer_secret: 'nudPcqqf8gBI2oCW5s6b2ysYfpakE7TCOYVVfeFc6o8VBBHZck',
	  access_token_key: '910889721034719232-Oe16stq2sreERtLwvmWKjnFpwJLUuJg',
	  access_token_secret: 'EKG0Lk7YOTxJJa7FN9gqXg8b4nyLnCAivngw7WAuF2EZW',
	});

	// getting keys from another file
	var query = new Twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	})

	var params = {screen_name: 'yo_sleek', count: 20};

	query.get('statuses/user_timeline', params, function(error, tweets, response) {

		if (!error) {
	      // console.log(tweets[0].text);
	      for (var i = 0; i < tweets.length; i++) {
	      	console.log(tweets[i].text, `*Time: ${tweets[i].created_at}*`);
	      }
	    }

	})
}

spotifySong = (songName) => {

  var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
  });

  // var songName = process.argv[3];
  var limit = 5

  spotify.search({ type: 'track', query: process.argv[3] ? process.argv[3] : songName, limit: limit }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

	for(var i = 0; i < limit; i++) {
      console.log(`Result ${i+1}`);
      console.log(`--------------------`);
      console.log(`Artist(s) Name: ${data.tracks.items[i].artists[0].name}`); 
      console.log(`Album Name: ${data.tracks.items[i].album.name}`); 
      console.log(`Song Name: ${data.tracks.items[i].name}`);  
      console.log(`Spotify Preview Link: ${data.tracks.items[i].external_urls.spotify}`); 
      console.log(`Popularity: ${data.tracks.items[i].popularity}`); 
      console.log(`--------------------`);
      console.log(`\n`);
    } 

  });
}

searchMovie = (movieName) => {
  
  var request = require('request');

  // var movieName = process.argv[3];
  if (process.argv[3]) {
  	var queryUrl = "http://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=40e9cece";
  } else {
  	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
  }

  request(queryUrl, function (error, response, body) {

	if (!error && response.statusCode === 200) {
	  console.log('Title: ', JSON.parse(body).Title);
	  console.log('Year: ', JSON.parse(body).Year);
	  console.log('IMDB Rating: ', JSON.parse(body).imdbRating);
	  console.log(JSON.parse(body).Ratings[1].Source, 'Rating:', JSON.parse(body).Ratings[1].Value);
	  console.log('Produced in: ', JSON.parse(body).Country);
	  console.log('Language: ', JSON.parse(body).Language);
	  console.log('Plot: ', JSON.parse(body).Plot);
	  console.log('Actors: ', JSON.parse(body).Actors);
    }

  })
}

doWhatItSays = () => {

	fs.readFile('random.txt', 'utf8', function(error, data) {

		var dataArr = data.split(',');
		console.log(dataArr[0]);
		console.log(dataArr[1]);

		switch (dataArr[0]) {
			case 'my-tweets':
				myTweets();
				break;

			case 'spotify-this-song':
				spotifySong(dataArr[1]);
				break;

			case 'movie-this':
				searchMovie(dataArr[1]);
				break;

		}

	})

}

switch (command) {
	case 'my-tweets':
		myTweets();
		break;

	case 'spotify-this-song':
		spotifySong();
		break;

	case 'movie-this':
		searchMovie();
		break;

	case 'do-what-it-says':
		doWhatItSays();
		break;
}






