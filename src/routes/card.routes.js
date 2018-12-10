const express = require('express');
const router = express.Router();

const Card = require("../models/card");
const User = require("../models/user");

router.get("/:cardname", async (req, res) => {
    const { cardname } = req.params;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    const dbcard = await Card.findOne({ cardname });

    if (dbcard == null) {
        res.json({status: "incorrect"})
    }
    else // User Card
    if (__user != null && __user.cards !== undefined && __user.cards.find(c => {return c === cardname})) {
        res.json({status: "cards", card: dbcard});
    }
    else // Cardholder
    if (__user != null && __user.cardholder !== undefined && __user.cardholder.find(friend => {return friend.cardname === cardname}))
    {
        res.json({status: "cardholder", card: dbcard});
    }
    else // Keeper
    if (__user != null && __user.keepers !== undefined && __user.keepers.find(keeper => {return keeper.cardname === cardname}))
    {
        res.json({status: "keepers", card: dbcard});
    }
    else // Private
    if (dbcard.is_private !== undefined && dbcard.is_private) {
        res.json({status: "private", card: dbcard});
    }
    else // Public
    {
        res.json({status: "public", card: dbcard});
    }
});

router.get("/sync/:cardname", async (req, res) => {
    const { cardname } = req.params;

    var dbcard = await Card.findOne({ cardname });
    if (dbcard !== null) {
        res.json({status: "updated", updated: dbcard.updated || dbcard.date});
    } else {
        res.json({status: "incorrect"})
    }
});

module.exports =  router;