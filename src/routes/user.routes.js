const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Card = require("../models/card");

// REGISTRATION OR LOGIN IF EXIST
router.post("/", async (req, res) => {
    //TODO: check user with session
    const { email, password, from } = req.body;

    var user = await User.findOne({email: new RegExp(email, 'i')});

    if (user == null) { //REGISTER
        user = new User({
            email,
            password,
            from,
            enabled: true,
            date: new Date().getTime()
        });
        await user.save();

        req.session.__email = email;
        req.session.__password = password;
        
        res.json({status: "registered", "session": req.sessionID});
    }
    else    //LOGIN
    {
        user = await User.findOne({
            "email": email,
            "password": password
        });
    
        if (user != null && user.enabled === true) {
            req.session.__email = email;
            req.session.__password = password;
            res.json({status: "login", "session": req.sessionID});
        } else 
        if (user != null && user.disabled === false) {
            res.json({status: "disabled"});
        } else {
            res.json({status: "incorrect"});
        }
    }
});

//GET USER BY SESSION
router.post('/:session', async (req, res) => {
    const { email, password } = req.body;
    const { session } = req.params;
    if (session !== res.sessionID) {
        req.session.__email = email;
        req.session.__password = password;
    }
    const dbUser = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });
    res.json({ user: dbUser, session: req.sessionID });
});

//CHECK USER BY SESSION
router.post('/cs/:session', async (req, res) => {
    const { email, password } = req.body;
    const { session } = req.params;


    res.json({ status: "session", session: req.sessionID });
});




//GET USER BY ID
router.get("/:email/:password", async (req, res) => {
    const { email, password } = req.params;

    const user = await User.findOne({
        "email": email,
        "password": password
    });

    if (user != null && user.enabled === true) {
        req.session.__email = email;
        req.session.__password = password;
        res.json({status: "login", "session": req.sessionID});
    } else 
    if (user != null && user.disabled === false) {
        res.json({status: "disabled"});
    } else {
        res.json({status: "incorrect"});
    }
});

//GET USER BY ID
router.get("/:id", async (req, res) => {
    //TODO: check user with session
    const user = await User.findById(req.params.id);

    res.json(user);
});


//UPDATE
router.put('/:id', async (req, res) => {
    //TODO: check user with session
    const { email, password } = req.body;
    //TODO: check email
    const newUser = {email, password};
    console.log(req.params.id);

    await User.findByIdAndUpdate(req.params.id, newUser);

    res.json({status: "updated"});
});

//TODO: REMOVE THIS for user
router.delete('/:id', async (req, res) => {
    await User.findByIdAndRemove(req.params.id);
    res.json({status: "deleted"});
});


module.exports =  router;
