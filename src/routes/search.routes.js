const express = require('express');
const router = express.Router();

const Card = require("../models/Card");
const User = require("../models/User");

const filterCard = require("../helphers/filterCard");

const SEARCH_LIMIT = 100;
// SEARCH
router.post("/", async (req, res) => {

    const { q, skip } = req.body;

    console.log(q, skip)

    const user = await User.findById(req.session._id);

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

    let searchCards = [];
    for (const card of cards) {
        let f_card = await filterCard(user, card, true);
        if (f_card.status !== "incorrect") {
            searchCards.push(f_card.card);
        }
    }

    res.json({ok: true, q: q, cards: searchCards});
});


module.exports =  router;