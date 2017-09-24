
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var colors = require('colors');

var command = process.argv[2];

myTweets = () => {

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
	      console.log('-----------------------------------------');
	      for (var i = 0; i < tweets.length; i++) {
	      	console.log(`Time: ${tweets[i].created_at}`.gray.bold, tweets[i].text.cyan.bold);
	      }
	      console.log('-----------------------------------------');
	    }

	})
}

spotifySong = (songName) => {

  var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
  });
  
  spotify.search({ type: 'track', query: songName ? songName : 'The Sign Ace of Base'}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
	console.log('-----------------------------------------');
    console.log(`Artist(s) Name: ${data.tracks.items[0].artists[0].name}`.magenta.bold); 
    console.log(`Album Name: ${data.tracks.items[0].album.name}`.magenta.bold); 
    console.log(`Song Name: ${data.tracks.items[0].name}`.magenta.bold);  
    console.log(`Spotify Preview Link: ${data.tracks.items[0].external_urls.spotify}`.magenta.bold); 
    console.log(`Popularity: ${data.tracks.items[0].popularity}`.magenta.bold); 
    console.log('-----------------------------------------');
  });
}

searchMovie = (movieName) => {
  
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

  request(queryUrl, function (error, response, body) {

  	if (error) {
  	  console.log(error);
  	  return;
  	}

	if (!error && response.statusCode === 200) {
	  console.log('-----------------------------------------');
	  console.log('Title: ', JSON.parse(body).Title.green.bold);
	  console.log('Year: ', JSON.parse(body).Year.green.bold);
	  console.log('IMDB Rating: ', JSON.parse(body).imdbRating.green.bold);
	  console.log(JSON.parse(body).Ratings[1].Source, 'Rating:', JSON.parse(body).Ratings[1].Value.green.bold);
	  console.log('Produced in: ', JSON.parse(body).Country.green.bold);
	  console.log('Language: ', JSON.parse(body).Language.green.bold);
	  console.log('Plot: ', JSON.parse(body).Plot.green.bold);
	  console.log('Actors: ', JSON.parse(body).Actors.green.bold);
	  console.log('-----------------------------------------');
    }

  })
}

doWhatItSays = () => {

	fs.readFile('random.txt', 'utf8', function(error, data) {

		var dataArr = data.split(',');

		if (error) {
		  console.log(error);
		  return;
		}

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

inquirer
  .prompt([

    {
      type: 'list',
	  name: 'command',
	  message: 'What command would you like?',
	  choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
    }

  ])
  .then(function(input) {

  	if (input.command === 'my-tweets') {
  		myTweets();
  	} else if (input.command === 'spotify-this-song') {
  		inquirer
  		  .prompt([

  		    {
  		      type: 'input',
			  message: 'Enter a song name. Enter artist after song name for more accuracy (i.e. learning to fly tom petty)',
			  name: 'song'
  		    }

  		  ])
  		  .then(function(song) {
  		  	spotifySong(song.song);
  		  })
  	} else if (input.command === 'movie-this') {
  	    inquirer
  	      .prompt([

            {
              type: 'input',
			  message: 'Enter a title of a movie',
			  name: 'movie'
            }

  	      ])
  	      .then(function(movie) {
  	      	searchMovie(movie.movie);
  	      })
  	} else if (input.command === 'do-what-it-says') {
  		doWhatItSays();
  	}

  })






