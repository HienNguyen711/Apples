var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  if(id === undefined){
    res.status(503);

  }
  else{
    var products = products[id] || {};
    res.status(200);
    res.render('productsItem',{product:product});
  }


});

module.exports = router;
