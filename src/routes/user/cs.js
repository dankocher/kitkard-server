const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Session = require("../../models/Session");

//CHECK USER BY SESSION
router.get('/:session', async (req, res) => {
    const { session } = req.params;

    if (session === req.sessionID) {
        res.json({ok: true, session: req.sessionID});
    } else {
        const __sess = await Session.findById(session);
        if (__sess != null) {
            const j_sess = await JSON.parse(__sess.session);
            req.session._id = j_sess._id;
            await __sess.delete();
            res.json({ok: true, status: "session", session: req.sessionID});
        } else {
            res.json({ok: false, status: "incorrect"})
        }
    }
});

module.exports =  router;
