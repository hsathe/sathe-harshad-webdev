module.exports = function () {
  
    var mongoose = require("mongoose");
    var TravelYaarUserSchema = mongoose.Schema({
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        facebook: {
            token: String,
            id: String
        },
        google: {
            token: String,
            id: String
        },
        followers: {type: Array, default: []},
        following: {type: Array, default: []},
        recommendations: {type: Array, default: []},
        role: {type: String, default: "regular"},
        application: {type:String, default: "TravelYaar"},
        dataCreated: {type: Date, default: Date.now}
    }, {collection:"travelyaar.user"});
    
    return TravelYaarUserSchema;
};