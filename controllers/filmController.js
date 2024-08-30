const { Movie, Genre, Actor, Director } = require('../models/filmsModel');



const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_ ]{3,23}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


module.exports = {
    addFilm: async (req, res) => {
        try {
            const { movie_name, genre_id, actor_ids, director_ids } = req.body;
        
           
            if (!movie_name || !genre_id || !actor_ids.length || !director_ids.length) {
                return res.status(400).json({ message: 'All fields are required' });
            }
        
            
            const existingMovie = await Movie.findOne({ movie_name });
            if (existingMovie) {
                return res.status(409).json({ message: 'Movie already exists' });
            }
        
            
            const createdMovie = await Movie.create({
                movie_name,
                genres: genre_id,
                actors: actor_ids, 
                directors: director_ids 
            });
        
           
            res.status(201).json({ id: createdMovie._id });
        
        } catch (err) {
            console.error(err.message);
            res.status(400).json({ message: 'An error occurred', err: err.message });
        }
        
    },
    getFilm: async (req, res) => {
        try {
            const { movie_name, genre_id, actor_id, director_id } = req.body;
    
            if (!movie_name && !genre_id && !actor_id && !director_id) {
                return res.status(400).json({ message: 'At least one search criterion is required' });
            }
    
            const query = {};
            if (movie_name) query.movie_name = movie_name;
            if (genre_id) query.genres = genre_id;
            if (actor_id) query.actors = actor_id;
            if (director_id) query.directors = director_id;
    
            const movie = await Movie.findOne(query)
                .populate('genres', 'genre_name')
                .populate('actors', 'actor_name')
                .populate('directors', 'director_name');
    
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
    
            res.status(200).json(movie);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },
    

    getFilms: async (req, res) => {
        try {
            const movies = await Movie.find()
                .populate('genres', 'genre_name')
                .populate('actors', 'actor_name')
                .populate('directors', 'director_name');
            res.status(200).json(movies);
        } catch (err) {

            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
            
        }
    },
    

    updateFilm: async (req, res) => {
        try {
            const { _id, movie_name, genre_id, actor_ids, director_ids } = req.body;
    
            if (!_id) {
                return res.status(400).json({ message: 'Movie ID not provided' });
            }
    
            const updatedMovie = await Movie.findOneAndUpdate(
                { _id },
                {
                    $set: {
                        movie_name,
                        genres: genre_id,
                        actors: actor_ids,
                        directors: director_ids
                    }
                },
                { new: true } 
            ).populate('genres', 'genre_name')
             .populate('actors', 'actor_name')
             .populate('directors', 'director_name');
    
            if (!updatedMovie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            res.status(200).json(updatedMovie);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },

    deleteFilm: async (req, res) => {
        const movieIdToDelete = req.params.id;
        try {
            if (!movieIdToDelete) {
                return res.status(404).json({ message: 'Movie ID not provided' });
            }
            const deletedMovie = await Movie.deleteOne({ _id: movieIdToDelete });
    
            if (deletedMovie.deletedCount === 0) {
                return res.status(404).json({ message: 'Movie not found' });
            }
    
            res.status(204).send(); 
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    }, 

    
    addGenre: async (req, res) => {
        try {
            const { genre_name } = req.body;
            console.log(req.body);
            
            if (!genre_name) {
                return res.status(400).json({ message: 'Genre name is required' });
            }

            const newGenre = await Genre.create({ genre_name });
            res.status(201).json(newGenre);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },

    // Add a new actor
    addActor: async (req, res) => {
        try {
            const { actor_name } = req.body;
            if (!actor_name) {
                return res.status(400).json({ message: 'Actor name is required' });
            }

            const newActor = await Actor.create({ actor_name });
            res.status(201).json(newActor);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },

    addDirector: async (req, res) => {
        try {
            const { director_name } = req.body;
            if (!director_name) {
                return res.status(400).json({ message: 'Director name is required' });
            }

            const newDirector = await Director.create({ director_name });
            res.status(201).json(newDirector);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },

    getGenres: async (req, res) => {
        try {
            const genres = await Genre.find();
            res.status(200).json(genres);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },

    getActors: async (req, res) => {
        try {
            const actors = await Actor.find();
            res.status(200).json(actors);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },

    getDirectors: async (req, res) => {
        try {
            const directors = await Director.find();
            res.status(200).json(directors);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    }
    



}
