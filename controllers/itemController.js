const Item = require("../models/item");

const async = require("async");

// Display list of all Items.
exports.item_list = (req, res, next) => {
  Item.find({}, "name price amountInStock") //summary moet niet worden meegegven in lijst
    .sort({ name: 1 })
    .exec(function (err, list_items) {
        if (err) {
            return next(err);
        }
        res.render("item_list", { title: "Item List", item_list: list_items });
    });
};

// Display detail page for a specific Item.
exports.item_detail = (req, res, next) => {
  async.parallel(
    {
        item(callback) {
            Item.findById(req.params.id)
                .populate("name")
                .populate("price")
                .populate("summary")
                .populate("amountInStock")
                .exec(callback);
        },
    },
    (err, results) => {
        if (err) {
            return next(err);
        }
        if (results.item == null) {
            //no resulsts
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }
        //Sucessful, so render
        res.render("item_detail", {
            name: results.item.name,
            item: results.item,
        });
    }
  );
};

// Display Item create form on GET.
exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create GET");
};

// Handle Item create on POST.
exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create POST");
};

// Display Item delete form on GET.
exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

// Handle Item delete on POST.
exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

// Display Item update form on GET.
exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update GET");
};

// Handle Item update on POST.
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};