const express = require('express');
const router = express.Router();

const USERNAME = 'admin';
const PASSWORD = '1b9b0d083243cd0aae015d1604a08637';

router.post("/login/", async (req, res) => {
    const { username, password} = req.body;

    if (username === USERNAME && password === password) {
        res.json({status: "login"})
    } else {
        res.json({status: "incorrect"});
    }
});

router.get("/session/", async (req, res) => {

    // res.setHeader('Access-Control-Allow-Origin', 'http://192.168.100.23:5000');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.session.username === USERNAME && req.session.password === password) {
        req.session.username = username;
        req.session.password = password;
        res.json({status: "login"})
    } else {
        res.json({status: "incorrect"});
    }
});

module.exports =  router;