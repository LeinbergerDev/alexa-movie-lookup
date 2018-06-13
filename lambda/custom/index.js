'use strict';
const Alexa = require("alexa-sdk");
const request = require('request');

const SKILL_NAME = 'movie lookup';

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var movieData = [];
// helper for getting movie data from imdb.
var getMovie = function (title) {
    var data = [];
    axios.get(`http://www.omdbapi.com/?t={title}&apikey=a8f38fbd`)
    .then( response => data = response.data )
    this.emit( 'Movie Title' + data.Title );
}

var handlers = {
    'LaunchRequest': function () {
        this.response.speak("Welcome to movie lookup. What movie would you like me to lookup?").listen();
        this.emit(':responseReady');
    },
    'MovieIntent': function() {
        const title = this.event.request.intent.slots.title.value;
        console.log(title);
        const url = `http://www.omdbapi.com/?t=${title}&apikey=a8f38fbd`;
        console.log(url);
        request.get(url, (error, response, data) => {
            console.log('error', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('data:', data);

            const theMovie = JSON.parse(data);
            const speechOutput = `${theMovie.Title} was released ${theMovie.Released}. It was directed by ${theMovie.Director} and written by ${theMovie.Writer}.  The cast includes ${theMovie.Actors}.  It's about ${theMovie.Plot} and grossed ${theMovie.BoxOffice} at the box office.`;
            console.log(theMovie);
            console.log(speechOutput);
            this.response.cardRenderer(SKILL_NAME, theMovie.Title);
            this.response.speak(speechOutput + " Would you like me to lookup another movie?").listen("Would you like another movie?");
            this.emit(':responseReady');
        });

    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Thank you for trying movie lookup, goodbye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, ask movie lookup for info about avengers' or 'alexa, ask movie lookup about Thor'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, ask movie lookup for info about avengers'" +
            " or 'alexa, ask movie lookup about Thor'");
    }
};
