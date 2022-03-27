var express = require('express');
var router = express.Router();

/* Post Login. */
router.post('/', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
 
    if(req.body.username == "test" && req.body.passw == "test"){
        res.send("Helloo")
    }
    
});

module.exports = router;