const Card = require("../models/Card");
const Notification = require("../models/Notification");

const saveNotifications = async (card) => {
    const notifications = card.notifications;
    if (notifications !== undefined && notifications !== null) {
        for (const n of notifications) {
            let notification = new Notification({
                type: n.type,
                cardname: card.cardname,
                from_cardname: n.from_cardname,
                viewed: n.viewed,
                action: n.action,
                shared_cardname: n.shared_card,
                updated: n.updated || n.date,
                date: n.date,
            });
            await notification.save()
        }
    }
};

const start = async () => {
    let cards = await Card.find({notifications: {$exists: true}});
    for (const card of cards) {
        if (card.notifications !== undefined) {
            if (card.notifications !== null) {
                await saveNotifications(card);
            }
            card.notifications = undefined;
            await card.save();
            console.log(card.cardname);
        }
    }
};

start();
