require("dotenv").config();

var keys = require('./keys')

var fs = require('fs')

var axios = require('axios')

var moment = require('moment')


const search = process.argv[2]

let queryArr = []

for (let i = 3; i < process.argv.length; i++) {
    queryArr.push(process.argv[i])
}

let query = queryArr.join('+')

switch (search) {
    case 'concert-this':
        axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp")
        .then(function(response) {
            if (response.data.length === 0) {
                console.log('Nothing found')
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

        break;

    case 'spotify-this-song':

    break;

    case 'movie-this':

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
    break;
}