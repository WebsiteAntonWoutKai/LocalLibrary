var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/test', function(req, res, next){
  res.send('This is a test');
});

router.get('/login', user_controller.user_login_get);

router.post('/login', user_controller.user_login_post);

module.exports = router;
