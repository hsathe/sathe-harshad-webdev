module.exports = function (app, models) {
    var TravelYaarUserModel = models.travelyaarUserModel;
    var PlaceModel = models.placeModel;

    app.post("/api/place", createPlace);
    // app.get("/api/place/:placeId", getPlaceById);
    app.get("/api/place/:placeId", getPlaceByPlaceId);
    app.put("/api/place/:place", updatePlace);

    function createPlace(req, res) {
        var place = req.body;
        PlaceModel
            .findPlaceByPlaceId(place.place_id)
            .then(
                function (status) {
                    if (status) {
                        res.status(400).send("Place already exists");
                    } else {
                        PlaceModel
                            .createPlace(place)
                            .then(
                                function (newPlace) {
                                    res.json(newPlace);
                                }, function (err) {
                                    res.status(400).send("Unable to create place");
                                }
                            )
                    }
                }
            );
    }

    function getPlaceByPlaceId(req, res) {
        var placeID = req.params.placeId;
        console.log("Getting Place by Id- In Server");
        PlaceModel
            .findPlaceByPlaceId(placeID)
            .then(
                function (status) {
                    if (status) {
                        res.status(200).send("Place exists");
                    } else {
                        res.status(400).send("Place does not exist");
                    }
                }
            );
    }

    function removeAllFavoritesBy(user) {
        return PlaceModel
            .update(
                {_id: {$in: user.favorites}},
                {$pull: {favBy: user._id}},
                {multi: true});
    }
    
    function updatePlace(req, res) {
        var place_id = req.params.place_id;
        var newPlace = req.body;
        PlaceModel.updatePlace(place_id, newPlace)
            .then(function () {
                res.status(200).send("Updated Place");
            },
            function (err) {
                res.status(400).send("Could not update place")
            });
    }


}