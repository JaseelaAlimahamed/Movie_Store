const mongoose = require('mongoose');

// Movies Schema
const movieSchema = new mongoose.Schema({
    movie_name: {
        type: String,
        required: true
    },
    genres: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor'
    }],
    directors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director'
    }]
});

// Genres Schema
const genreSchema = new mongoose.Schema({
    genre_name: {
        type: String,
        required: true
    }
});

// Actors Schema
const actorSchema = new mongoose.Schema({
    actor_name: {
        type: String,
        required: true
    }
});

// Directors Schema
const directorSchema = new mongoose.Schema({
    director_name: {
        type: String,
        required: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);
const Genre = mongoose.model('Genre', genreSchema);
const Actor = mongoose.model('Actor', actorSchema);
const Director = mongoose.model('Director', directorSchema);

module.exports = { Movie, Genre, Actor, Director };
