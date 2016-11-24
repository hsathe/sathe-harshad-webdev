module.exports = function () {
    var mongoose = require("mongoose");
    
    var WebsiteSchema = mongoose.Schema({
        developerId: {type: mongoose.Schema.ObjectId, ref: "user"},
        name: String,
        description: String,
        pages: {type: Array, default: []},
        dateCreated: {type: Date, default: Date.now}
    },{collection: "website"});
    
    return WebsiteSchema;
};