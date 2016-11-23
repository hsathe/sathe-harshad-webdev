module.exports = function () {
    var mongoose = require("mongoose");
    // var WebsiteSchema = require("mongoose");
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        email: String,
        firstName: String,
        lastName: String,
        websites: {type: Array, default: []},
        dateCreated: {type: Date, default: Date.now}
        // websites: [{type: mongoose.Schema.Types.ObjectId, ref: "WebsiteModel"}]
        // websites: [WebsiteSchema],--> Embedded Schema
    },{collection: "user"});
    return UserSchema;
};