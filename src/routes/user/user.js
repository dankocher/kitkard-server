const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Session = require("../../models/Session");

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
