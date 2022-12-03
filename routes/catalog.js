const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdmin");



// Require controller modules.
const item_controller = require("../controllers/itemController");
const contact_controller = require("../controllers/contactController");
const category_controller = require("../controllers/categoryController");
const user_controller = require("../controllers/userController");
const admin_controller = require("../controllers/adminController");
const home_controller = require("../controllers/homeController");


router.get("/", home_controller.index);


/// CATEGORY ROUTES ///

// GET request for creating Category. 
//router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category.
//router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Category.
router.get("/categories", category_controller.category_list);

/// ITEM ROUTES ///

// GET request for creating Item. NOTE This must come before route for id (i.e. display item).
//router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item.
//router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item.
//router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item.
//router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item.
//router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item.
//router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Item.
router.get("/items", item_controller.item_list);

router.get("/item/:id/addToCart", item_controller.addToCart_get);

router.post("/item/:id/addToCart", item_controller.addToCart_post);

router.post("/item/:id/addOne", item_controller.addOneItem);

router.post("/item/:id/removeOne", item_controller.removeOneItem);

router.post("/item/:id/remove", item_controller.removeItem);

/// CONTACT ROUTES ///

//niet allemaal nodig -> nog uitzoeken welke vervangen mogen worden

// GET request for creating Contact. NOTE This must come before route for id (i.e. display item).
router.get("/contact/create", contact_controller.contact_create_get);

// POST request for creating Contact.
router.post("/contact/create", contact_controller.contact_create_post);

// GET request to delete Contact.
router.get("/contact/:id/delete", contact_controller.contact_delete_get);

// POST request to delete Contact.
router.post("/contact/:id/delete", contact_controller.contact_delete_post);

// GET request to update Contact.
router.get("/contact/:id/update", contact_controller.contact_update_get);

// POST request to update Contact.
router.post("/contact/:id/update", contact_controller.contact_update_post);

// GET request for one Contact.
router.get("/contact/:id", contact_controller.contact_detail);

// GET request for list of all Contacts.
router.get("/contacts", contact_controller.contact_list);

/// USER ROUTES ///

//router.post('/user/login', user_controller.user_login_post);

//router.get('/user/register', user_controller.user_register_get);

//router.post('/user/register', user_controller.user_register_post);

router.get('/user/protected', user_controller.user_protected_get);

// GET request to delete User.
router.get("/user/:id/delete", user_controller.user_delete_get);

// POST request to delete User.
router.post("/user/:id/delete", user_controller.user_delete_post);

// GET request to update User.
router.get("/user/:id/update", user_controller.user_update_get);

// POST request to update User.
router.post("/user/:id/update", user_controller.user_update_post);

// GET request for one User.
router.get("/user/:id", user_controller.user_detail);

// GET request for list of all User.
router.get("/users", user_controller.user_list);

router.get('/user', user_controller.user_protected_get);

router.get("/user/:id/logout", user_controller.user_logout_get);

router.get('/user/login', user_controller.user_login_get);

router.get('/user/:id/cart', user_controller.user_cart);

//router.get('/user/:id/addToCart', user_controller.user_addToCart_get);

//router.post('/user/:id/addToCart', user_controller.user_addToCart_post);

module.exports = router;