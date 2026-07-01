const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3020;

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
    console.log('Connected to MongoDB successfully');
});

// Schema and Model
const userSchema = new mongoose.Schema({
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

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/post', async (req, res) => {
    try {
        const {
            roll_no,
            name,
            gender,
            dob,
            address,
            city,
            pincode,
            district,
            father_name,
            father_phone,
            father_occupation,
            mother_name,
            mother_phone,
            mother_occupation,
            religion,
            mother_tongue,
        } = req.body;

        // Create a new user document
        const newUser = new User({
            roll_no,
            name,
            gender,
            dob,
            address,
            city,
            pincode,
            district,
            father_name,
            father_phone,
            father_occupation,
            mother_name,
            mother_phone,
            mother_occupation,
            religion,
            mother_tongue,
        });

        // Save the user to the database
        await newUser.save();

        console.log('Data saved:', newUser);
        res.redirect('/dashboard.html');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Failed to save data.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
