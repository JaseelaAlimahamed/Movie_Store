const contact = require('../models/contactsModel')


const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_ ]{3,23}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


module.exports = {
    addContact: async (req, res) => {
        try {
            if (!req.body.name || !req.body.mobile || !req.body.email || !req.body.Country) {
                return res.status(400).json({ message: 'fields required' });
            }

            if (!USER_REGEX.test(req.body.name)) {
                return res.status(400).json({
                    message: 'name - "4 to 23 characters", "Must begin with a letter", "Letters, numbers, underscores, hyphens allowed."'
                });
            }
            if (!EMAIL_REGEX.test(req.body.email)) {
                return res.status(400).json({
                    message: 'Enter Valid EmailId'
                });
            }

            if (!MOBILE_REGEX.test(req.body.mobile)) {
                return res.status(400).json({ message: 'Enter a valid number.' });
            }

            const response = await users.findOne({
                $or: [
                    { name: req.body.name },
                    { mobile: req.body.mobile }
                ]
            });


            if (response) {
                return res.status(409).json({ message: 'Contact - already exists' });
            }

            const createdtContact = await contact.create({ name: req.body.name, mobile: req.body.mobile, email: req.body.email, country: req.body.country });
            res.status(201).json({ id: createdContact._id });

        } catch (err) {
            console.error(err.message);
            res.status(400).json({ message: 'An error occurred', err: err.message });
        }
    },

    getContacts: async (req, res) => {
        try {
            const contacts = await contact.find();
            res.status(200).json(contacts);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },

    updateContact: async (req, res) => {
        try {
            if (!req.body._id) {
                return res.status(400).json({ message: 'Contact details not provided' });
            }

            const updatedContact = await contact.findOneAndUpdate(
                { _id: req.body._id },
                {
                    $set: {
                        name: req.body.name,
                        mobile: req.body.mobile,
                        email: req.body.email,
                        country: req.body.country
                    }
                }
            )

            if (!updatedContact) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            res.status(200).json(updatedContact);
        } catch (err) {
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }
    },

    deleteContact: async (req, res) => {
        const contactToDelete = req.params.id;
        try {
            if (!contactToDelete) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            const deletedContact = await contact.deleteOne({ _id: contactToDelete });

            res.status(204).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'An error occurred', err: err.message });
        }

    }



}
