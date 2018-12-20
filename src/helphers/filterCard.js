const {isCardholder, isPrivateEnabled, isKeeper} = require("../helphers/cardholder");

const filterCard = async (user, card) => {
    if (card == null) {
        return({status: "incorrect"})
    }
    else // User Card
    if (user != null && user.cards !== undefined && user.cards.find(c => {return c === card.cardname})) {
        return({status: "cards", card: card});
    }
    else // Cardholder
    if (user != null && isCardholder(user, card))
    {
        let contacts = card.contacts !== undefined ? card.contacts.ids !== undefined : {byId: {}, ids: []};
        if (isPrivateEnabled(user, card)) {
            contacts = filterPrivateContacts(contacts);
        }

        return({status: "cardholder", card: {
                cardname: card.cardname,
                name: card.name,
                description: card.description,
                pictures: card.pictures,
                updated: card.updated,
                is_private: card.is_private,
                contacts: contacts,
            }});
    }
    else // Keeper
    if (user != null && (isKeeper(user, card) && !card.is_private))
    {
        let contacts = card.contacts !== undefined ? card.contacts.ids !== undefined : {byId: {}, ids: []};
        contacts = filterPrivateContacts(contacts);

        return({status: "keepers", card: {
                cardname: card.cardname,
                name: card.name,
                description: card.description,
                pictures: card.pictures,
                updated: card.updated,
                is_private: card.is_private,
                contacts: contacts,
            }});
    }
    else // Private
    if (card.is_private !== undefined && card.is_private) {
        return({status: "private", card: {
                cardname: card.cardname,
                is_private: card.is_private,
                updated: card.updated
            }});
    }
    else // Public
    {
        let contacts = card.contacts !== undefined ? card.contacts.ids !== undefined : {byId: {}, ids: []};
        contacts = filterPrivateContacts(contacts);

        return({status: "keepers", card: {
                cardname: card.cardname,
                name: card.name,
                description: card.description,
                pictures: card.pictures,
                updated: card.updated,
                is_private: card.is_private,
                contacts: contacts,
            }});
    }
};

const filterPrivateContacts = (contacts) => {

    const p_contacts = {byId: {}, ids: []};
    if (contacts.ids !== undefined && contacts.ids.isPrototypeOf(Array)) {
        for (const id of contacts.ids) {
            const contact = contacts.byId[id];
            if (!contact.is_private) {
                p_contacts.byId[id] = contact;
                p_contacts.ids.push(id);
            }

        }
    }
    return p_contacts;
};

module.exports = filterCard;