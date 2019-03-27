const express = require('express');
const router = express.Router();

const User = require("../models/User");
const Card = require("../models/Card");
const Session = require("../models/Session");

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
        if (from === "g" || from === "f") {
            user = await User.findOne({
                "email": email
            });
        } else {
            user = await User.findOne({
                "email": email,
                "password": password
            });
        }
        console.log(email);
        console.log(from);
        console.log(user);
        if (user != null && user.enabled === true) {
            req.session.__email = email;
            req.session.__password = user.password;
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
        // req.session.__email = email;
        // req.session.__password = password;
    }
    console.log(req.session)
    const dbUser = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });
    console.log(dbUser)
    res.json({ user: dbUser, session: req.sessionID });
});

router.get("/sync/", async(req, res) => {
    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    if (__user !== null) {
        res.json({status: "updated", updated: __user.updated || __user.date});
    } else {
        res.json({status: "incorrect"})
    }
});

router.post("/save_search/", async(req, res) => {
    //TODO: Sync and save search!!!!!!!!!!
    const { card, updated } = req.body;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    if (__user !== null) {
        if (__user.search === undefined) {
            __user.search = []
        }

        res.json({status: "updated", updated: __user.updated});
    } else {
        res.json({status: "incorrect"})
    }
});

router.post("/update/", async(req, res) => {
    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    if (__user == null) {
        res.json({status: "incorrect"})
    }
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
