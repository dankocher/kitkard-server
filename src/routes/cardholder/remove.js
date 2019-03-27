const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Card = require("../../models/Card");
const Friend = require("../../models/Friend");
const Notification = require("../../models/Notification");

const filterCard = require("../../helphers/filterCard");
const {isCardholder, isRequested} = require("../../helphers/cardholder");

const N = {
    requested_card: "requested_card",
    added_card: "added_card",
};

// REMOVE CARD FROM CARDHOLDER
router.delete("/", async (req, res) => {
    const { friend, cardname } = req.body;

    const user = await User.findById(req.session._id);
    const f_card = await Card.findOne({cardname: friend});
    const c_card = await Card.findOne({cardname: cardname});

    if( user == null || c_card == null || f_card == null
        || user.cards.find(c => c === cardname) === undefined
        || user.cards.find(c => c === friend) !== undefined) {
        res.json({ok: false, 'status': 'incorrect'});
    } else {

        const date = new Date().getTime();

        let friend_card = await Friend.findOne({cardname: cardname, friend_cardname: friend});



        if (friend_card !== null) {
            if (!friend_card.enabled) {
                let notification = await Notification.findOne({
                    cardname: friend,
                    from_cardname: cardname,
                    type: "requested_card",
                    hidden: false
                });
                if (notification !== null) {
                    notification.hidden = true;
                    notification.updated = date;
                    await notification.save();
                }
            }
            friend_card.deleted = true;
            friend_card.enabled = false;
            friend_card.updated = date;
            await friend_card.save();
        }


        // await Friend.deleteOne({cardname: cardname, friend_cardname: friend});

        res.json({ok: true, status: "deleted", updated: date});
    }
});

module.exports =  router;