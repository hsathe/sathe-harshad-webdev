(function () {
    angular
        .module("PlacesApp")
        .controller("RecommendationController", RecommendationController);
    
    function RecommendationController($sce, $location, $routeParams, $rootScope, TravelYaarUserService) {
        var vm = this;
        vm.recommendations = [];
        vm.seeButton = false;
        function init() {
            console.log("In Recommendation Controller");
//  TodO for userId route Path:

            vm.userId = $rootScope.currentUser._id;
            vm.otherUserId = $rootScope.currentUser._id;
            vm.user = $rootScope.currentUser;
            vm.seeButton = false;
            fetchForMe();
        }
        init();

        function fetchForMe() {
            TravelYaarUserService
                .getRecommendationsForUser(vm.userId)
                .then(
                    function (response) {
                        compileResults(response.data);
                    },
                    function (err) {
                        vm.recommendations = [];
                    }
                )
        }
        
        function compileResults(data) {
            vm.recommendations.length = 0;
            for(var i = data.length - 1;i >=0;i--){
                vm.recommendations.push({
                    added : false,
                    error : false,
                    place: {
                        _id: data[i]._id,
                        name: data[i].name,
                        place_id: data[i].place_id,
                        formatted_address:data[i].formatted_address,
                        totalReco: data[i].recommendedBy.length,
                        photo_reference: data[i].photo_reference,
                        rating: data[i].rating
                    }
                });
            }
            return vm.recommendations;
        }
    }
})();