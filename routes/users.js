var express = require('express');
var router = express.Router();
const user_controller = require("../controllers/userController");

/*
const csrf = require('csurf');
var csrfProtection = csrf();

router.use(csrfProtection);
*/


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next){
  res.send('This is a test');
});

router.get('/login', user_controller.user_login_get);

router.post('/login', user_controller.user_login_post);

router.get('/register', user_controller.user_register_get);

router.post('/register', user_controller.user_register_post);

module.exports = router;
