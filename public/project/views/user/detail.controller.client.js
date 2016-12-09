(function () {
    angular
        .module("PlacesApp")
        .controller("DetailsController",DetailsController);
    
    function DetailsController(APIService,$routeParams, $http) {
        var vm = this;
        vm.searchDetail = searchDetail;
        function init() {
            
            var placeId = $routeParams.placeId;
            APIService
                .searchDetail(placeId)
                .success(function (response) {
                    vm.detail = response.result;
                });
        }

        init();

        function searchDetail() {
            var placeId = $routeParams.placeId;
            console.log(placeId);
        }
    }
})();