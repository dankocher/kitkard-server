const express = require('express');
const router = express.Router();

const Card = require("../models/card");
const User = require("../models/user");


router.post("/create/", async (req, res) => {
    //TODO: check user with session
    const { cardname } = req.body;

    if (req.session.__email === undefined)  //User is not logged
    {
        res.json({ status: "incorrect" });
    }
    else
    {
        var dbcard = await Card.findOne({ cardname });
        if (dbcard == null) //Card not Exist
        {
            const dbUser = await User.findOne({
                email: req.session.__email,
                password: req.session.__password
            });

            if (dbUser == null) {  //Incorrect User
                res.json({ status: "incorrect" });
            } else {
                const card = new Card({
                    cardname,
                    uid: dbUser._id.toString(),
                    is_private: false,
                    date: new Date().getTime(),
                });
                await card.save();
                if (dbUser.cards === undefined || dbUser.cards.length === 0) {
                    dbUser.cards = [];
                    dbUser.cards.push(cardname);
                    dbUser.username = cardname;
                } else {
                    dbUser.cards.push(cardname);
                }
                dbUser.updated = new Date().getTime();
                await dbUser.save();
                res.json({ status: 'created', user: dbUser, card: card });
            }
        }
        else    //Card exist
        {    
            res.json({ status: "exist" });
        }
    }
});

//SAVE USER BY SESSION
router.post('/save/:cardname', async (req, res) => {
    const { card } = req.body;
    const { cardname } = req.params;
    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

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
            res.json({status: 'updated'});
        } else {
            res.json({status: 'error'});
        }
    } else {
        res.json({status: 'incorrect'});
    }

    // res.json({ user: dbUser, session: req.sessionID });
});

// DELETE CARD
router.delete('/delete/:cardname', async (req, res) => {
    const { cardname } = req.params;
    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    if (__user !== null && __user.username !== cardname
        && __user.cards.find(c => {return c === cardname}) !== undefined) {
        Card.deleteOne({cardname: cardname}, err => {
            if (!err) {
                __user.cards.splice(__user.cards.indexOf(cardname), 1);
                __user.updated = new Date().getTime();
                __user.save();
                res.json({status: "deleted"});
            } else {
                res.json({status: "incorrect"})
            }
        })
    } else {
        res.json({status: "incorrect"})
    }
});

module.exports =  router;