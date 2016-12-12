module.exports = function () {
    var mongoose = require("mongoose");
    var PlaceSchema = require("./place.schema.server")();
    var PlaceModel = mongoose.model("PlaceModel", PlaceSchema);

    var api = {
        createPlace: createPlace,
        addRecommendationByUser: addRecommendationByUser,
        removeRecommendationByUser: removeRecommendationByUser,
        findPlaceByPlaceId: findPlaceByPlaceId,
        getRecommendationsForUser : getRecommendationsForUser,
        getUserFeed : getUserFeed,
        getFilteredFeed : getFilteredFeed,
        updatePlace : updatePlace
    };
    return api;

    function createPlace(place) {
        return PlaceModel.create(place);
    }
    
    function addRecommendationByUser(placeId, userId) {
        return PlaceModel
            .update({place_id: placeId}, {
                $push: {recommendedBy: userId}
            });
    }
    
    function removeRecommendationByUser(placeId, userId) {
        return PlaceModel
            .update({place_id: placeId}, {
                $pull: {recommendedBy: userId}
            });
    }
    
    function findPlaceByPlaceId(placeId) {
        return PlaceModel.findOne({place_id: placeId});
    }
    
    function getRecommendationsForUser(user) {
        return PlaceModel.find({place_id: {$in: user.recommendations}})
    }

    function getUserFeed(user) {
        return PlaceModel.find({
            $and: [
                {place_id: {$nin: user.recommendations}},
                {recommendedBy: {$in: user.following}}
            ]
        });
    }
    // Fetch those places which are not recommended by the user.
    function getFilteredFeed(user) {
        return PlaceModel.find({
            place_id:{$nin: user.recommendations}
        });
    }
    
    function updatePlace(placeId, place) {
        delete place._id;
        return PlaceModel
            .update({place_id: placeId},{
                $set: {
                    name: place.name,
                    formatted_address: place.formatted_address,
                    rating: place.rating,
                    recommendedBy: place.recommendedBy
                }
            });
    }
    
}