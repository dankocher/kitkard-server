const express = require('express');
const router = express.Router();

const Card = require("../../../models/Card");
const User = require("../../../models/User");

router.post("/", async (req, res) => {
    //TODO: check user with session
    const { cardname } = req.body;

    if (req.session._id === undefined)  //User is not logged
    {
        res.json({ ok: false, status: "incorrect" });
    }
    else
    {
        var dbcard = await Card.findOne({ cardname: new RegExp(cardname, 'i') });
        if (dbcard == null) //Card not Exist
        {
            const dbUser = await User.findById(req.session._id);

            if (dbUser == null) {  //Incorrect User
                res.json({ ok: false, status: "incorrect" });
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
                res.json({ ok: true, status: 'created', user: dbUser, card: card });
            }
        }
        else    //Card exist
        {
            setTimeout(() => {
                res.json({ ok: false, status: "exist" });
            }, 2000);
        }
    }
});


module.exports =  router;
