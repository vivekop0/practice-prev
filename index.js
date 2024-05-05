const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// You need to define `JWT_SECRET` somewhere in your code
const JWT_SECRET = 'your_secret_key_here'; // Make sure to secure this and manage via environment variables in production

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    // Do DB validations here, fetch id of user from DB

    const token = jwt.sign({ id: 1 }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true }); // Set httpOnly to true to prevent client-side script access to the cookie
    res.send("Logged in!");
});

app.get("/user", (req, res) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Get additional user information from the database here
        res.send({
            userId: decoded.id
        });
    } catch (error) {
        res.status(401).send('Invalid Token');
    }
});

app.post("/logout", (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.json({
        message: "Logged out!"
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
