module.exports = function () {
    var mongoose = require("mongoose");
    
    var PlaceSchema = mongoose.Schema({
        place_id : String,
        name: String,
        formatted_address: String,
        photo_reference: String,
        recommendedBy: {type: Array, default:[]}
    },{collection: "travelyaar.place"});
    
    return PlaceSchema;
}