var express = require('express');
var router = express.Router();
const admin_controller = require("../controllers/adminController");
const item_controller = require("../controllers/itemController");
const authAdmin = require('../middleware/authAdmin');

/// ADMIN ROUTES ///

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a admin resource');
});

router.get("/test", function(req, res, next){
    res.send('This is a test');
});

router.get("/:id", authAdmin, admin_controller.admin_details);

router.get("/:id/addProduct", authAdmin, admin_controller.addProduct_get);

router.post("/:id/addProduct", authAdmin, admin_controller.addProduct_post);

router.get("/:id/addCategory", authAdmin, admin_controller.addCategory_get);

router.post("/:id/addCategory", authAdmin, admin_controller.addCategory_post);

//router.get("/:id/removeProduct", authAdmin, admin_controller.removeProduct_get);

//router.post("/:id/removeProduct", authAdmin, admin_controller.removeProduct_post);

//router.get("/:id/updateProduct", authAdmin, admin_controller.updateProduct_get);

//router.post("/:id/updateProduct", authAdmin, admin_controller.updateProduct_post);

router.get("/item/:id/delete", authAdmin, item_controller.item_delete_get);

router.post("/item/:id/delete", authAdmin, item_controller.item_delete_post);

router.get("/item/:id/update", authAdmin, item_controller.item_update_get);

router.post("/item/:id/update", authAdmin, item_controller.item_update_post);

module.exports = router;