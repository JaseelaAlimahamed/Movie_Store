const users = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv/config')

const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_ ]{3,23}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;

module.exports = {
    userSignup: async (req, res) => {
        try {
            if (!req.body.mobile || !req.body.password || !req.body.name) {
                return res.status(400).json({ message: 'name, mobile, password - fields required' });
            }
    
            if (!USER_REGEX.test(req.body.name)) {
                return res.status(400).json({
                    message: 'name - "4 to 23 characters", "Must begin with a letter", "Letters, numbers, underscores, hyphens allowed."'
                });
            }
    
            if (!PWD_REGEX.test(req.body.password)) {
                return res.status(400).json({
                    message: 'password - "8 to 24 characters", "Must include uppercase and lowercase letters, a number and a special character", "Allowed special characters: ! @ # * $ % "'
                });
            }
    
            if (!MOBILE_REGEX.test(req.body.mobile)) {
                return res.status(400).json({ message: 'Enter a valid number.' });
            }
    
            const response = await users.findOne({ name: req.body.name });
    
            if (response) {
                return res.status(409).json({ message: 'User - already exists' });
            }
    
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const createdUser = await users.create({ name: req.body.name, mobile: req.body.mobile, password: hashedPassword });
    
            const accessToken = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ accessToken });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },
    userSignin: async (req, res) => {
        try {
            const { name, password } = req.body;
            if (!name || !password) return res.status(400).json({ 'message': 'UserName and password required.' });
    
            const foundUser = await users.findOne({ name });
            if (!foundUser) return res.status(401).json({ message: 'incorrect UserName or password' }); // Unauthorized
    
            const response = await bcrypt.compare(password, foundUser.password);
    
            if (response) {
                const accessToken = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                res.status(200).json({ accessToken, name: foundUser.name, mobile: foundUser.mobile });
            } else {
                res.status(401).json({ message: 'incorrect mobile number or password' });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },
    
}