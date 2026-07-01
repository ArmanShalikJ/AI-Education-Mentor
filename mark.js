const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serve static files from 'public' directory

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/students", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Schema
const studentSchema = new mongoose.Schema({
    studentName: String,
    rollNo: String,
    classSelect: String,
    groupSelect: String,
    marks: Object
});

const Student = mongoose.model("Mark", studentSchema);

// Serve HTML file when accessing "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"mark.html"));
});

// API Endpoint to save student marks
app.post("/api/students", async (req, res) => {
    try {
        const { studentName, rollNo, classSelect, groupSelect, ...marks } = req.body;
        const student = new Student({ studentName, rollNo, classSelect, groupSelect, marks });
        await student.save();
        res.status(201).json({ message: "Student Marks Saved!" });
    } catch (error) {
        res.status(500).json({ error: "Error saving data" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
