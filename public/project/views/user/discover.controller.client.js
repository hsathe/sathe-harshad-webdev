(function () {
    angular
        .module("PlacesApp")
        .controller("DiscoverController", DiscoverController);

    function DiscoverController(APIService, $rootScope, PlaceService, TravelYaarUserService,$location, $routeParams) {
        var vm = this;
        vm.user = $rootScope.currentUser;
        vm.attractions = [];
        vm.keywords = $routeParams.keywords;
        vm.googlekey = "";
        function init(){
            // vm.googlekey = "";
            APIService
                .getGoogleKey()
                .then(
                    function (res) {
                        vm.googlekey = res.data;
                    }
                );
            
            if(vm.keywords){
                search(vm.keywords, vm.googlekey);
                $location.url("/discover/"+vm.keywords);
            } 
        }
        init();

        vm.search = search;
        vm.loadPhoto = loadPhoto;
        vm.addRecommendation = addRecommendation;
        
        function search(keywords) {
            APIService
                .search(keywords, vm.googlekey)
                .then(function (response) {
                    TravelYaarUserService
                        .getRecommendationsForUser(vm.user._id)
                        .then(
                            function (userRecommendations) {
                                var mine = compilePseudoRecommendations(userRecommendations.data);
                                var pseudoResults = compilePseudoResults(response.data);

                                if(pseudoResults.length != 0 && mine.length != 0){
                                    for(var i=0;i < pseudoResults.length;i++){
                                        for(var j=0;j < mine.length; j++){
                                            if(pseudoResults[i].place_id == mine[j].place_id){
                                                pseudoResults[i].added = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                vm.attractions = pseudoResults;
                            },
                            function (err) {
                                // If there are no recommendations, just compileResults which has all the search results.
                                vm.attractions = compilePseudoResults(response.data);
                            }
                        );
                    // vm.attractions = response.data.results;
                },
                function (err) {
                    vm.attractions = [];
                });
        }
        
        function compilePseudoRecommendations(data) {
            var f = [];
            for(var i= data.length - 1; i>=0; i--){
                f.push({
                    place_id:data[i].place_id
                });
            }
            return f;
        }
        
        function compilePseudoResults(data) {
            var f = [];
            var k = 0;
            for(var i=0; i<= data.results.length - 1;i++){
                var imageUrl = "";
                try{
                    var ref = data.results[i].photos[0].photo_reference;
                    imageUrl = loadPhoto(ref);
                }catch(err) {
                    imageUrl = "No image to display";
                }
                f.push({
                    place_id: data.results[i].place_id,
                    name: data.results[i].name.replace(/(\r\n|\n|\r)/gm,""),
                    formatted_address: data.results[i].formatted_address.replace(/(\r\n|\n|\r)/gm,""),
                    rating: data.results[i].rating,
                    photo_reference: imageUrl,
                    added:false,
                    error:false
                });
            }
            return f;
        }

        function loadPhoto(photo_reference) {
            return APIService.getPhotoByPhotoReference(photo_reference, vm.googlekey);
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

        vm.logout = function(){
            TravelYaarUserService
                .signout()
                .then(
                    function(response){
                        $rootScope.currentUser = null;
                        $location.url("/");
                    }
                );
        }
    }
})();