(function () {
    angular
        .module("PlacesApp")
        .factory("PlaceService", PlaceService);
    
    function PlaceService($http) {
        var api = {
            
            createPlace: createPlace,
            getPlaceByPlaceId: getPlaceByPlaceId
        };
        
        return api;
        
        function createPlace(newPlace) {
            console.log("Create Place: " + newPlace.place_id);
            return $http.post("/api/place", newPlace);
        }
        
        function getPlaceByPlaceId(placeId) {
            console.log("Getting Place by ID:"+placeId);
            return $http.get("/api/place/"+placeId);
        }
    }
})();
