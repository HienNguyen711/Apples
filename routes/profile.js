var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    res.render('profile', { title: 'Profile',user: req.user});
  }
  else{
    res.redirect('/login');
  }



});

module.exports = router;
