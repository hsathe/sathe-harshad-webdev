(function () {
    angular
        .module("PlacesApp")
        .controller("RecommendationController", RecommendationController);
    
    function RecommendationController($sce, $location, $routeParams, $rootScope, TravelYaarUserService) {
        var vm = this;
        function init() {
            console.log("In Recommendation Controller");       
        }
        init();
    }
})();