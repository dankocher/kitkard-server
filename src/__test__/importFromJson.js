
/*
var fs = require("fs");
const importUsers = async () => {
    console.log("\n *STARTING* \n");
    var contents = fs.readFileSync("src/old_data/users.json");
    var users = JSON.parse(contents);
    for (const u of users) {
        let __user = await User.findOne({username: u.username});
        if (__user == null) {
            let user = new User({
                oldid: u.oldid,
                username: u.username,
                email: u.email,
                password: u.password,
                updated: u.updated,
                enabled: true,
                date: u.date,
                cards: u.cards
            });
            await user.save();
        }
    }
    console.log("\n *Users was saved* \n");
    setTimeout(importCards, 1000);
};
const importCards = async () => {
    console.log("\n *STARTING* \n");
    var contents = fs.readFileSync("src/old_data/cards.json");
    var cards = JSON.parse(contents);
    for (const c of cards) {
        let __card = await Card.findOne({cardname: c.cardname});
        if (__card == null) {
            const user = await User.findOne({cards: c.cardname});
            let card = new Card({
                uid: user._id,
                oldid: c.oldid,
                cardname: c.cardname,
                is_private: c.is_private,
                description: c.description,
                name: c.name,
                pictures: c.pictures,
                updated: c.updated,
                date: c.date,
                contacts: c.contacts,
                c_updated: c.c_updated,
                cardholder: c.cardholder,
                k_updated: c.k_updated,
                keepers: c.keepers,
                n_updated: c.n_updated,
                notifications: c.notifications,
            });
            // console.log(card);
            await card.save();
        }
    }
    console.log("\n *Cards was saved* \n");
};

setTimeout(importUsers, 2000);
*/
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



