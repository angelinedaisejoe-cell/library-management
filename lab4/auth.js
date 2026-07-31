const express = require('express');
const Member = require('../models/Member');

const router = express.Router();


app.post("/api/register", async (req, res) => {
    try {

        const member = new Member(req.body);

        await member.save();

        res.json({
            message: "Member Registered Successfully",
            member
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    const member = await Member.findOne({
        email,
        password
    });

    if (!member) {

        return res.status(401).json({
            message: "Invalid Email or Password"
        });

    }

    res.json({
        message: "Login Successful",
        member
    });

});

module.exports = router;