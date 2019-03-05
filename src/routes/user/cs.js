const express = require('express');
const router = express.Router();

const User = require("../../models/user");
const Session = require("../../models/Session");

//CHECK USER BY SESSION
router.get('/cs/:session', async (req, res) => {
    const { session } = req.params;

    console.log("**************************")
    console.log("SESSION", session, req.sessionID)

    if (session === req.sessionID) {
        res.json({status: "ok"});
    } else {
        const __sess = await Session.findOne({_id: session});
        if (__sess !== null) {
            const j_sess = await JSON.parse(__sess.session);
            req.session.__email = j_sess.__email;
            req.session.__password = j_sess.__password;
            await __sess.delete();
            res.json({status: "session", session: req.sessionID});
        } else {
            res.json({status: "incorrect"})
        }
    }
});

module.exports =  router;
