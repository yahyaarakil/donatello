var express = require('express');
var router = express.Router();

/* Post Login. */
router.post('/', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
    if(req.body.username == "test" && req.body.passw == "test"){
        res.send("Helloo")
    }
    
});

module.exports = router;