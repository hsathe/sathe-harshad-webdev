module.exports = function () {
    var mongoose = require("mongoose");
    var PlaceSchema = require("./place.schema.server")();
    var PlaceModel = mongoose.model("PlaceModel", PlaceSchema);

    var api = {
        createPlace: createPlace,
        addRecommendationByUser: addRecommendationByUser,
        removeRecommendationByUser: removeRecommendationByUser,
        findPlaceByPlaceId: findPlaceByPlaceId,
        getRecommendationsForUser : getRecommendationsForUser
    };
    return api;

    function createPlace(place) {
        return PlaceModel.create(place);
    }
    
    function addRecommendationByUser(placeId, userId) {
        return PlaceModel
            .update({placeId: placeId}, {
                $push: {recommendedBy: userId}
            });
    }
    
    function removeRecommendationByUser(placeId, userId) {
        return PlaceModel
            .update({placeId: placeId}, {
                $pull: {recommendedBy: userId}
            });
    }
    
    function findPlaceByPlaceId(placeId) {
        return PlaceModel.findOne({place_id: placeId});
    }
    
    function getRecommendationsForUser(user) {
        return PlaceModel.find({place_id: {$in: user.recommendations}})
    }
}