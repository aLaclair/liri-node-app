require("dotenv").config();

var keys = require('./keys')

var fs = require('fs')

var axios = require('axios')

var moment = require('moment')

var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify)



let search = process.argv[2]

let queryArr = []

for (let i = 3; i < process.argv.length; i++) {
    queryArr.push(process.argv[i])
}

let query = queryArr.join('+')

switch (search) {

    case 'concert-this':
        concert()
        break;

    case 'spotify-this-song':
       song()
    break;

    case 'movie-this':
        movie()
    break;

    case 'do-what-it-says':
        fs.readFile('random.txt', 'utf8', function(err, data) {
            if(err) {
                console.log(err);
            }
            else {
                let dataArr = data.split(',')
                console.log(dataArr)
                search = dataArr[0].trim()
                query = dataArr[1].trim()
                switch (search) {
                    case 'concert-this':
                        concert()
                    break;

                    case 'spotify-this-song':
                        song()
                    break;

                    case 'movie-this':
                    movie()
                    break;
                }
            }
        })
                break;
}


function concert() {
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp")
    .then(function(response) {
        if (response.data.length === 0) {
            console.log('----------------------------------')
            console.log('Nothing found')
            console.log('----------------------------------')

        } else {
            console.log('----------------------------------')

            for (let i = 0; i < response.data.length; i++) {
                console.log('Venue Name: ' + response.data[i].venue.name)
                console.log('Location: ' + response.data[i].venue.location)
                console.log('Date: ' + moment(response.data[i].datetime).format('MM/DD/YYYY') + ' at ' + moment(response.data[i].datetime).format('h:mm:ss A'))
                console.log('--------------')
            }

            console.log('----------------------------------')
        }
    })
}

function song() {
    if (query === '') {
        spotify.search({ type: 'track', query: 'The Sign', limit: 1 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
           
            let album = data.tracks.items[0]
            let artists = []

            console.log(('----------------------------------'))
            for (let i = 0; i < album.artists.length; i++) {
                artists.push(' ' + album.artists[i].name)
            }
            console.log('Artist(s):' + artists)
            console.log('Song Name: ' + album.name)
            if (album.preview_url !== null) {
            console.log('Preview: ' + album.preview_url)
            } else {
                console.log('Preview: No preview. Blame Spotify, not me.')
            }
            console.log('Album Name: ' + album.album.name)
            console.log((('----------------------------------')))


          });
    } else {
    spotify.search({ type: 'track', query: query, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        let album = data.tracks.items[0]
        let artists = []

        
        if (data.tracks.total === 0) {
            console.log('----------------------------------')
            console.log('No Song Found!')
            console.log('----------------------------------')

        }
        else {
        console.log(('----------------------------------'))
        for (let i = 0; i < album.artists.length; i++) {
            artists.push(' ' + album.artists[i].name)
        }
        console.log('Artist(s):' + artists)
        console.log('Song Name: ' + album.name)
        if (album.preview_url !== null) {
        console.log('Preview: ' + album.preview_url)
        } else {
            console.log('Preview: No preview. Blame Spotify, not me.')
        }
        console.log('Album Name: ' + album.album.name)
        console.log((('----------------------------------')))


    }});
    }
}

function movie() {
    if(query === '') {
        axios.get('http://www.omdbapi.com/?t=Mr.+Nobody&apikey=f614f73a')
        .then(function(response) {
            let data = response.data


            console.log('----------------------------------')
            console.log('Title: ' + data.Title)
            console.log('Year: ' + data.Year)
            console.log('IMDB Rating: ' + data.Ratings[0].Value)
            console.log('Rotten Tomatoes Rating: ' + data.Ratings[1].Value)
            console.log('Producing Countries: ' + data.Country)
            console.log('Language: ' + data.Language)
            console.log('Plot: ' + data.Plot)
            console.log('Actors: ' + data.Actors)
            console.log('----------------------------------')


        })
    } else {
        axios.get('http://www.omdbapi.com/?t=' + query + '&apikey=f614f73a')
        .then(function(response) {
            let data = response.data
            if(data.Error === 'Movie not found!') {
                console.log(data.Error)
            } else {


            console.log('----------------------------------')
            console.log('Title: ' + data.Title)
            console.log('Year: ' + data.Year)
            console.log('IMDB Rating: ' + data.Ratings[0].Value)
            console.log('Rotten Tomatoes Rating: ' + data.Ratings[1].Value)
            console.log('Producing Countries: ' + data.Country)
            console.log('Language: ' + data.Language)
            console.log('Plot: ' + data.Plot)
            console.log('Actors: ' + data.Actors)
            console.log('----------------------------------')


         }})
    }
}