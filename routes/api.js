var express = require('express');
var router = express.Router();
//mockApi.json
var api = require('../api/mockApi.json');
//iterate array from object
var apiArray = Object.keys(api).map(function(value){
  return api[value]
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('api', { title: 'api',apiArray: apiArray,user:req.user });
});

module.exports = router;
