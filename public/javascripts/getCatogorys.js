//const Category = require("../models/category");
let category_list = ["truien", "jassen"];

console.log("infile");

// Category.find()
//     .sort([["name", "ascending"]])
//     .exec(function (err, list_categories) {
//         if (!err)
//             category_list = list_categories;
//         });

function get_category_list(){
    return category_list;
}
console.log(category_list);