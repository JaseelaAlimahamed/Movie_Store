const router = require('express').Router();
const userController=require('../controllers/userController')
const filmController=require('../controllers/filmController')
const verifyToken= require('../middleware/verifyToken')
//user signIN/signUp

router.post('/signup',userController.userSignup) 
router.post('/login',userController.userSignin)

//contacts
router.post('/addFilm',verifyToken,filmController.addFilm) 
router.get('/getFilms',verifyToken,filmController.getFilms) 
router.post('/getFilm',verifyToken,filmController.getFilm) 
router.post('/editFilm',verifyToken,filmController.updateFilm)
router.post('/deleteFilm',verifyToken,filmController.deleteFilm)


// Routes to add genres, actors, and directors
router.post('/addGenre', verifyToken, filmController.addGenre);
router.post('/addActor', verifyToken, filmController.addActor);
router.post('/addDirector', verifyToken, filmController.addDirector);

// Routes to get genres, actors, and directors for dropdowns
router.get('/genres', verifyToken, filmController.getGenres);
router.get('/actors', verifyToken, filmController.getActors);
router.get('/directors', verifyToken, filmController.getDirectors);

module.exports = router;