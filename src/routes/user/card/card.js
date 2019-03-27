const express = require('express');
const router = express.Router();

const Card = require("../../../models/Card");
const User = require("../../../models/User");

//SAVE USER BY SESSION
router.post('/save/:cardname', async (req, res) => {
    const { card } = req.body;
    const { cardname } = req.params;
    const __user = await User.findById(req.session._id);

    if (card.cardname === cardname && __user != null && __user.cards.find(c => {return c === cardname}) !== undefined) {
        const response = await Card.updateOne({cardname: cardname},
            {
                name: card.name || "",
                description: card.description || "",
                is_private: card.is_private || false,
                updated: card.updated || card.date,
                pictures: card.pictures || [],
                contacts: card.contacts || {
                    byId: {},
                    ids: []
                }
            });
        if (response.ok) {
            res.json({ok: true, status: 'updated'});
        } else {
            res.json({ok: false, status: 'error'});
        }
    } else {
        res.json({ok: false, status: 'incorrect'});
    }

    // res.json({ user: dbUser, session: req.sessionID });
});

// DELETE CARD
router.delete('/delete/:cardname', async (req, res) => {
    const { cardname } = req.params;
    const __user = await User.findById(req.session._id);

    if (__user !== null && __user.username !== cardname
        && __user.cards.find(c => {return c === cardname}) !== undefined) {
        Card.deleteOne({cardname: cardname}, err => {
            if (!err) {
                __user.cards.splice(__user.cards.indexOf(cardname), 1);
                __user.updated = new Date().getTime();
                __user.save();
                res.json({ok: true, status: "deleted", updated: __user.updated});
            } else {
                res.json({ok: false, status: "incorrect"})
            }
        })
    } else {
        res.json({ok: false, status: "incorrect"})
    }
});

module.exports =  router;
