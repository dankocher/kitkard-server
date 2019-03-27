const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Card = require("../../models/Card");
const Friend = require("../../models/Friend");
const Session = require("../../models/Session");

const filterCard = require("../../helphers/filterCard");
const {isMyCard, isCardholder, isRequested, isPrivateEnabled, isKeeper} = require("../../helphers/cardholder");

const N = {
    requested_card: "requested_card",
    added_card: "added_card",
};
// GET ALL NOTIFICATIONS
router.get("/:cardname/:updated", async (req, res) => {

    const {cardname, updated} = req.params;

    const user = await User.findById(req.session._id);

    if (user !== null && await user.cards.includes(cardname)) {
        const card = await Card.findOne({cardname});
        if (updated < card.friends_updated) {
            let friends = await Friend.find({cardname: cardname, updated: {$gte: updated}});
            res.json({ok: true, friends: friends, updated: card.friends_updated})
        } else {
            res.json({ok: true, status: "updated"})
        }
    } else {
        res.json({ok: false});
    }
});

module.exports =  router;