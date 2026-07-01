const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 4002;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname))); // Serve static files

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB (database: students) successfully');
});

// Define Schema and Model for the Faculty collection
const facultySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        collection: 'Faculty', // Explicitly set the collection name to Faculty
    }
);

const Faculty = mongoose.model('Faculty', facultySchema);

// Serve the Faculty Registration Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Facultyregister.html'));
});

// Handle Registration Requests
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        // Validate passwords match
        if (password !== confirm_password) {
            return res.status(400).send('Passwords do not match.');
        }

        // Check if the email already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).send('Faculty already registered with this email.');
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new faculty document
        const newFaculty = new Faculty({
            name,
            email,
            password: hashedPassword, // Store the hashed password
        });

        // Save the faculty to the database
        await newFaculty.save();

        console.log('Faculty registered:', newFaculty);

        // Redirect to the login page
        res.redirect('/Facultylogin.html');
    } catch (error) {
        console.error('Error saving faculty data:', error);
        res.status(500).send('Failed to register faculty.');
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
