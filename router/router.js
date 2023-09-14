const router = require('express').Router();
const userController=require('../controllers/userController')
const contactsController=require('../controllers/contactsController')

//user signIN/signUp

router.post('/signup',userController.userSignup) 
router.post('/signin',userController.userSignin)

//contacts
router.post('/addContact',contactsController.addContact) 
router.get('/getContacts',contactsController.getContacts) 
router.put('/editContact',contactsController.updateContact)
router.delete('/deleteContact',contactsController.deleteContact)

module.exports = router;