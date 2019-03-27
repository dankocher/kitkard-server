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


// ADD CARD TO CARDHOLDER
router.put("/", async (req, res) => {
    const { friend, cardname } = req.body;

    const __user = await User.findById(req.session._id);
    const f_card = await Card.findOne({cardname: friend});
    const c_card = await Card.findOne({cardname: cardname});


    if( __user == null || c_card == null || f_card == null
        || __user.cards.find(c => c === cardname) === undefined
        || __user.cards.find(c => c === friend) !== undefined) {
        res.json({ok:false, status: 'incorrect'});
    }
    else if(await isCardholder(__user, friend)) {
        res.json({ok:true, status: "already"});
    }
    else if(await isRequested(__user, friend)) {
        console.log("requested");
        res.json({ok: true, status: "already"});
    }
    else  {

        let newFriend = await Friend.findOne({
            cardname: cardname,
            friend_cardname: friend
        });

        const date = new Date().getTime();
        if (newFriend !== null) {
            newFriend.deleted = false;
            newFriend.updated = date;
            newFriend.enabled = !f_card.is_private;
            await newFriend.save();
        } else {
            newFriend = new Friend({
                cardname: cardname,
                friend_cardname: friend,
                enabled: !f_card.is_private,
                private_enabled: false,
                deleted: false,
                updated: date,
                date: date
            });
            await newFriend.save();
        }


        c_card.friends_updated = date;
        await c_card.save();


        let notification = new Notification({
            type: f_card.is_private ? N.requested_card : N.added_card,
            cardname: friend,
            from_cardname: cardname,
            updated: date,
            hidden: false,
            date: date
        });
        await notification.save();

        f_card.notifications_updated = date;
        await f_card.save();

        console.log("add:", f_card.is_private ? "requested" : "added");
        res.json({ok: true, status: f_card.is_private ? "requested" : "added", friend: newFriend});

    }
});



module.exports =  router;