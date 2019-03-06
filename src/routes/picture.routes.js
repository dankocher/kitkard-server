const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const sha256 = require('sha256');
const fs = require('fs');
const sharp = require('sharp');

const User = require("../models/user");
const Card = require("../models/card");

const PATH = '/var/www/kitkard/pictures/';
router.get("/:size/:pictureId", async (req, res) => {
    const {size, pictureId} = req.params;
    const _size = size === "l" || size === undefined ? "m" : size;
    const path = PATH + pictureId;
    const pathSized = PATH + pictureId + "." + _size;

    fs.readFile(pathSized, function (err, content) {
        if (err) {
            fs.readFile(path, function (err2, content2) {
                if (err2) {
                    fs.readFile(path, function (err2, content2) {
                        res.writeHead(200,{'Content-type':'image/jpg'});
                        res.end(PATH + 'logo_gray.png');
                    });
                    // res.writeHead(400, {'Content-type':'text/html'});
                    // console.log(err2);
                    // res.end("No such image");
                } else {
                    res.writeHead(200,{'Content-type':'image/jpg'});
                    res.end(content2);
                }
            })
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
    });
});

router.put("/:cardname/:size", async (req, res) => {
    const {size, cardname} = req.params;

    const user = User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });
    const c_card = user !== null && user.cards !== undefined ? user.cards.find(c => c === cardname) : null;
    if (user == null && c_card !== null) {
        req.json({status: "failed"})
    } else {
        const card = await Card.findOne({cardname: cardname});
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            const file = files['picture'];
            const oldPath = file.path;
            const name = sha256(cardname + new Date().getTime());
            const newPath = PATH + name + "." + size;
            fs.rename(oldPath, newPath, async (err) => {
                if (err) throw err;

                await sharp(newPath)
                    .resize(150)
                    .toFile(PATH + name + "." + "s", async(err, info) => {
                        if (err) throw err;

                        if (card.pictures === undefined){
                            card.pictures = [];
                        }
                        card.pictures = [name, ...card.pictures];
                        card.updated = new Date().getTime();
                        await card.save();
                        res.json({status: "ok", picture: name, updated: card.updated});
                    });
            });

        });
    }
});

router.delete("/:cardname/:picture", async(req, res) => {
    const {cardname, picture} = req.params;
    const user = User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });
    const c_card = user !== null && user.cards !== undefined ? user.cards.find(c => c === cardname) : null;
    if (user == null && c_card !== null) {
        req.json({status: "failed"})
    } else {
        await deleteFile(PATH + picture + ".s");
        await deleteFile(PATH + picture + ".m");
        await deleteFile(PATH + picture + ".l");

        const card = await Card.findOne({cardname: cardname});
        // console.log(card);
        const index = card.pictures.indexOf(picture);
        if (index !== -1) {
            card.pictures.splice(index, 1);
            card.updated = new Date().getTime();
            await card.save();
        }
        console.log(card.updated);
        res.json({status: "ok", updated: card.updated})
    }
});

const deleteFile = async (path) => {

    await fs.stat(path, async (err, stats) =>  {
        if (err) return false;

        await fs.unlink(path, function(err){
            if(err) return false;
            return true
        });
    });
}

module.exports =  router;
