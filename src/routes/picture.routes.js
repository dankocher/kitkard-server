const express = require('express');
const router = express.Router();
const fs = require('fs');

const PATH = '/var/www/kitkard/pictures/';
router.get("/:size/:pictureId", async (req, res) => {
    const {size, pictureId} = req.params;
    const path = PATH + pictureId + "." + size;

    fs.readFile(path, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'});
            console.log(err);
            res.end("No such image");
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
    });
});

module.exports =  router;