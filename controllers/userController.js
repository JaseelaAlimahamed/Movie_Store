const users = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv/config')

const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_ ]{3,23}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;

module.exports = {

    userSignup: async (req,res) => {

        console.log(req.body);
        
        try {
            const { username, password } = req.body;
    
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }
            
            if (!USER_REGEX.test(username)) {
                return res.status(400).json({
                    message: 'Username must be 4 to 23 characters long, begin with a letter, and can include letters, numbers, underscores, and hyphens.'
                });
            }
            
            if (!PWD_REGEX.test(password)) {
                return res.status(400).json({
                    message: 'Password must be 8 to 24 characters long, and include uppercase and lowercase letters, a number, and a special character.'
                });
            }
    
            const existingUser = await users.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists' });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const createdUser = await users.create({ username, password: hashedPassword });
    
            const accessToken = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ message: 'Signup Success', accessToken });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },
    userSignin: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required.' });
            }
    
            const foundUser = await users.findOne({ username });
            if (!foundUser) {
                return res.status(401).json({ message: 'Incorrect username or password.' }); // Unauthorized
            }
    
            const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    
            if (isPasswordCorrect) {
                const accessToken = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                res.status(200).json({ accessToken, username: foundUser.username });
            } else {
                res.status(401).json({ message: 'Incorrect username or password.' });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },
    
}