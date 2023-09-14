const router = require('express').Router();
const userController=require('../controllers/userController')
const contactsController=require('../controllers/contactsController')
const verifyToken= require('../middleware/verifyToken')
//user signIN/signUp

router.post('/signup',userController.userSignup) 
router.post('/signin',userController.userSignin)

//contacts
router.post('/addContact',verifyToken,contactsController.addContact) 
router.get('/getContacts',verifyToken,contactsController.getContacts) 
router.put('/editContact',verifyToken,contactsController.updateContact)
router.delete('/deleteContact',verifyToken,contactsController.deleteContact)

module.exports = router;