const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 1000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname))); // Serve static files
app.use(express.static('public')); // Serve static files from 'public' folder

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
const dbURI = 'mongodb://127.0.0.1:27017/students';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => {
    console.log('Connected to MongoDB successfully');
});

// Schema and Model
const studentSchema = new mongoose.Schema({
    roll_no: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    district: { type: String, required: true },
    father_name: { type: String, required: true },
    father_phone: { type: String, required: true },
    father_occupation: { type: String, required: true },
    mother_name: { type: String, required: true },
    mother_phone: { type: String, required: true },
    mother_occupation: { type: String, required: true },
    religion: { type: String, required: true },
    mother_tongue: { type: String, required: true },
});

const Student = mongoose.model('User', studentSchema);

// Routes
// Render login form
app.get('/login', (req, res) => {
    res.render('login'); // Render views/login.ejs
});

// Handle login form submission
app.post('/login', async (req, res) => {
    try {
        const { roll_no, dob } = req.body;

        if (!roll_no || !dob) {
            return res.status(400).send('Roll number and date of birth are required.');
        }

        // Ensure dob is in correct format and search for student in the database
        const parsedDob = new Date(dob);
        const student = await Student.findOne({ roll_no, dob: { $eq: parsedDob } });

        if (!student) {
            return res.status(404).send('Student not found or incorrect login details.');
        }

        // Render student profile
        res.render('studentProfile', { student });
    } catch (error) {
        console.error('Error retrieving student details:', error);
        res.status(500).send('An error occurred while retrieving student details.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/login`);
});
