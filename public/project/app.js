(function () {
    angular
        .module("PlacesApp",["ngRoute"]);
    //     .controller("AttractionSearchController", AttractionSearchController);
    //
    // function AttractionSearchController($http) {
    //     var vm = this;
    //     vm.searchAttractionsByPlace = searchAttractionsByPlace;
    //
    //     function searchAttractionsByPlace(place) {
    //         var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=attractions+" + place + "&key=AIzaSyABe0JiGEryUQQsl_MLJPtDt-9IaKz5WRQ";
    //         // var url = "http://www.omdbapi.com/?"+place;
    //         $http.get(url)
    //             .success(function (res) {
    //             vm.attractions = res.results;
    //         })
    //         console.log(place);
    //     }
    // }
})();