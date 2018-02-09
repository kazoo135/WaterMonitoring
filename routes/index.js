var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.render('index', {
        pageTitle:'Home',
        pageId: 'homepage'

    })
})

module.exports = router; 