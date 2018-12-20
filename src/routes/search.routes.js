const express = require('express');
const router = express.Router();



const Card = require("../models/card");
const User = require("../models/user");

const SEARCH_LIMIT = 100;
// SEARCH
router.post("/", async (req, res) => {

    const { q, skip } = req.body;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    const match = {"$or": [
            {cardname: new RegExp(`${q}.*`, 'i')},
            {name: new RegExp(`.*${q}.*`, 'i')},
            {description: new RegExp(`.*${q}.*`, 'i')}
        ]};

    const cards = await Card.aggregate([
        { $match: match },
        { $project: {
                cardname: 1,
                name: 1,
                description: 1,
                pictures: 1,
                is_private: 1,
            }
        },
        { $skip: skip },
        { $limit: SEARCH_LIMIT },
    ]);
    //TODO: check cards for friend,
    res.json({cards: cards});
});


module.exports =  router;