
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
	      	console.log(tweets[i].text);
	      }
	    }

	})
}

spotifySong = () => {

  var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
  });

  spotify.search({ type: 'track', query: 'I want it that way' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
 
      console.log(data.tracks.items[0]); 
    });
}

searchMovie = () => {
  
  var request = require('request');

  var movieName = process.argv[3];

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

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
}




