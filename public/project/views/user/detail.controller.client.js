(function () {
    angular
        .module("PlacesApp")
        .controller("DetailsController",DetailsController);
    
    function DetailsController(APIService,$routeParams, $http) {
        var vm = this;
        // vm.searchDetail = searchDetail;
        vm.googlekey = "";
        function init() {

            APIService.getGoogleKey()
                .then(
                    function (res) {
                        vm.googlekey = res.data;
                    }
                );

            vm.place_photos = "";
            var placeId = $routeParams.placeId;
            vm.keywords = $routeParams.keywords;
            APIService
                .searchDetail(placeId)
                .success(function (response) {
                    vm.detail = response.result;
                    console.log(response)
                        try{
                        vm.place_photos = APIService.getPhotoByPhotoReference(response.result.photos[0].photo_reference, vm.googlekey);
                        }catch (err){
                        }
                });
        }

        init();

        // function searchDetail() {
        //     var placeId = $routeParams.placeId;
        //     console.log(placeId);
        // }
    }
})();