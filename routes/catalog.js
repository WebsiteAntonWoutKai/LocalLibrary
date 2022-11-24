const express = require("express");
const router = express.Router();

// Require controller modules.
const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");
const item_controller = require("../controllers/itemController");
const contact_controller = require("../controllers/contactController");
const user_controller = require("../controllers/userController");

/// BOOK ROUTES ///

// GET catalog home page.
router.get("/", book_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/book/create", book_controller.book_create_get);

// POST request for creating Book.
router.post("/book/create", book_controller.book_create_post);

// GET request to delete Book.
router.get("/book/:id/delete", book_controller.book_delete_get);

// POST request to delete Book.
router.post("/book/:id/delete", book_controller.book_delete_post);

// GET request to update Book.
router.get("/book/:id/update", book_controller.book_update_get);

// POST request to update Book.
router.post("/book/:id/update", book_controller.book_update_post);

// GET request for one Book.
router.get("/book/:id", book_controller.book_detail);

// GET request for list of all Book items.
router.get("/books", book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/author/create", author_controller.author_create_get);

// POST request for creating Author.
router.post("/author/create", author_controller.author_create_post);

// GET request to delete Author.
router.get("/author/:id/delete", author_controller.author_delete_get);

// POST request to delete Author.
router.post("/author/:id/delete", author_controller.author_delete_post);

// GET request to update Author.
router.get("/author/:id/update", author_controller.author_update_get);

// POST request to update Author.
router.post("/author/:id/update", author_controller.author_update_post);

// GET request for one Author.
router.get("/author/:id", author_controller.author_detail);

// GET request for list of all Authors.
router.get("/authors", author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get(
    "/bookinstance/create",
    book_instance_controller.bookinstance_create_get
);

// POST request for creating BookInstance.
router.post(
    "/bookinstance/create",
    book_instance_controller.bookinstance_create_post
);

// GET request to delete BookInstance.
router.get(
    "/bookinstance/:id/delete",
    book_instance_controller.bookinstance_delete_get
);

// POST request to delete BookInstance.
router.post(
    "/bookinstance/:id/delete",
    book_instance_controller.bookinstance_delete_post
);

// GET request to update BookInstance.
router.get(
    "/bookinstance/:id/update",
    book_instance_controller.bookinstance_update_get
);

// POST request to update BookInstance.
router.post(
    "/bookinstance/:id/update",
    book_instance_controller.bookinstance_update_post
);

// GET request for one BookInstance.
router.get("/bookinstance/:id", book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get("/bookinstances", book_instance_controller.bookinstance_list);

/// ITEM ROUTES ///

// GET request for creating Item. NOTE This must come before route for id (i.e. display item).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Item.
router.get("/items", item_controller.item_list);

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

router.get('/user', user_controller.user_protected_get);

router.get('/user/login', user_controller.user_login_get);

router.post('/user/login', user_controller.user_login_post);

router.get('/user/register', user_controller.user_register_get);

router.post('/user/register', user_controller.user_register_post);

//router.get('/user/protected', user_controller.user_protected_get);

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

module.exports = router;