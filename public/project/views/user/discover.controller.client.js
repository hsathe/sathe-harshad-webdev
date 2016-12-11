(function () {
    angular
        .module("PlacesApp")
        .controller("DiscoverController", DiscoverController);

    function DiscoverController(APIService, $rootScope, PlaceService, TravelYaarUserService,$location, $routeParams) {
        var vm = this;
        vm.user = $rootScope.currentUser;
        vm.attractions = [];
        vm.keywords = $routeParams.keywords;

        function init(){
            console.log("In Discover Controller");
            if(vm.keywords){
                search(vm.keywords);
                $location.url("/discover/"+vm.keywords);
            } 

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
                // var imageUrl = ""
                // if(data.results[i].photos.length != 0){
                //     var ref = data.results[i].photos[0].photo_reference;
                //     imageUrl = loadPhoto(ref);
                // }
                f.push({
                    place_id: data.results[i].place_id,
                    name: data.results[i].name,
                    formatted_address: data.results[i].formatted_address,
                    rating: data.results[i].rating,
                    photo_reference: data.results[i].photos,
                    added:false,
                    error:false
                });
                // console.log(i+"-->"+imageUrl);
            }
            return f;
        }

        function loadPhoto(photo_reference) {
            APIService
                .getPhotoByPhotoReference(photo_reference)
                .success(function (response) {
                    var imageUrl = response;
                    console.log(imageUrl);
                    return imageUrl;
                })
                .error(function (err) {
                    console.log(err);
                })

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