var dotenv = require('dotenv').config({path: '.env.default'});
var Cloudant = require('cloudant');
var express = require('express');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

//connect to cloudant
var dbUrl = process.env.DB_URL;
var username = process.env.DB_USER;
var password = process.env.DB_PASSWORD;
var cloudant = Cloudant({account:username, password:password});

Cloudant({url:dbUrl, username:username, password:password}, function(er, cloudant, reply) {
    if (er)throw er;
     console.log('Connected with username: %s', reply.userCtx.name)
})

var router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));

router.get('/', function(req, res){
    res.render('index', {
        pageTitle:'Water Monitoring Analyzer - Pace University',
        pageId: 'homepage'
    })
})

router.post('/get-data', function(req, res){
    var dbname = req.body.db;
    var from = req.body.from;
    var to = req.body.to;
    var sensor1 = req.body.sensor1;
    var sensor2 = req.body.sensor2;
    var sensor3 = req.body.sensor3;
    var data = new Array();
    console.log(from, to);
    db = cloudant.db.use(dbname);
    var sql = {
        "selector": {
            "payload.ts": {
                "$gte": Number(from),
                "$lte": Number(to)
             },
            "_id": {
                "$gt": "0"
            }
        },
        "fields": [
            "payload.ts",
            "payload.s"
        ],
        // "sort": [
        //     "payload.ts"
        // ]
    };
    console.log(sql);
    db.find(sql, function(er, result) {
        if(er){throw er;}

        if(result.docs.length > 0){
            for(var i = 0; i < result.docs.length; i++){
                if(result.docs.hasOwnProperty(i)
                    && result.docs[i].hasOwnProperty('payload')
                    && result.docs[i].payload.hasOwnProperty('ts')
                    && result.docs[i].payload.hasOwnProperty('s')
                    && result.docs[i].payload.s.hasOwnProperty(0)
                    && result.docs[i].payload.s.hasOwnProperty(1)
                    && result.docs[i].payload.s.hasOwnProperty(2)
                    && result.docs[i].payload.s.hasOwnProperty(3)
                ){
                    var row = new Array();
                    row.push(result.docs[i].payload.ts);
                    //row.push(result.docs[i].payload.s[0].temp);
                    if(sensor1 == 'true')row.push(result.docs[i].payload.s[1].temp);
                    if(sensor2 == 'true')row.push(result.docs[i].payload.s[2].temp);
                    if(sensor3 == 'true')row.push(result.docs[i].payload.s[3].temp);
                    data.push(row);
                }
            }
            if (data.length > 0){
                res.json({
                    data: data,
                    msg: ""
                });
            }else {
                res.json({
                    data: data,
                    msg: "Data not found for your search parameters"
                });
            }
        }else{
            res.json({
                data: data,
                msg: "Data not found for your search parameters"
            });
        }
    });
})

module.exports = router; 