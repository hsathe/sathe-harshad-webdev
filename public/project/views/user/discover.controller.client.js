(function () {
    angular
        .module("PlacesApp")
        .controller("DiscoverController", DiscoverController);

    function DiscoverController(APIService, $rootScope, PlaceService, TravelYaarUserService) {
        var vm = this;
        vm.user = $rootScope.currentUser;
        vm.attractions = [];
        function init(){
            console.log("In Discover Controller");
        }
        init();

        vm.search = search;
        vm.loadPhoto = loadPhoto;
        vm.addRecommendation = addRecommendation;
        
        function search(keywords) {
            console.log("Searching for the attractions in "+keywords);
            APIService
                .search(keywords)
                .then(function (response) {
                    console.log(response.data.results);
                    console.log(response);

                    vm.attractions = response.data.results;

                });
        }

        function loadPhoto(photo_reference) {
            APIService
                .getPhotoByPhotoReference(photo_reference)
                .success(function (response) {
                    vm.imageUrl = response;
                    return response;
                });
            console.log(vm.imageUrl);
        }
        
        function addRecommendation(place) {
            PlaceService.getPlaceByPlaceId(place.place_id)
                .then(
                    function (success) {
                        TravelYaarUserService
                            .addToRecommendations(vm.user._id,place)
                            .then(
                                function (success) {
                                    place.added = true;
                                    place.error = false;
                                },
                                function (error) {
                                    place.added = false;
                                    place.error = true;
                                }
                            );
                    }, function (err) {
                        PlaceService
                            .createPlace(place)
                            .then(
                                function (newPlace) {
                                    TravelYaarUserService
                                        .addToRecommendations(vm.user._id, newPlace.data)
                                        .then(
                                            function (success) {
                                                place.added = true;
                                                place.error = false;
                                            },
                                            function (err) {
                                                place.added = false;
                                                place.error = true;
                                            }
                                        );
                                },
                                function (err) {
                                    place.added = false;
                                    place.error = true;
                                }
                            );
                    }
                );
        }


    }
})();