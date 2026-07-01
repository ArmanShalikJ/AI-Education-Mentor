const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 4004;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data from URL-encoded requests
app.use(express.json()); // Parse JSON requests
app.use(express.static(__dirname)); // Serve static files from the root directory

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

// Serve the Faculty Login Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Facultylogin.html'));
});

// Handle Login Requests
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        // Check if the email exists in the database
        const faculty = await Faculty.findOne({ email });
        if (!faculty) {
            console.log('Faculty not found:', email);
            return res.status(401).send('Faculty not registered. Please register first.');
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, faculty.password);
        if (!isPasswordValid) {
            console.log('Invalid login attempt for:', email);
            return res.status(401).send('Invalid email or password.');
        }

        console.log('Faculty logged in successfully:', faculty.name);

        // Send the mark.html file
        res.sendFile(path.join(__dirname, 'mark.html')); // Ensure mark.html is in the root directory
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Login failed.');
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
