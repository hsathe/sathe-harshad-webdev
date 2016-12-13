(function () {
    angular
        .module("PlacesApp")
        .controller("DetailsController",DetailsController);
    
    function DetailsController(APIService,$routeParams, $http) {
        var vm = this;
        vm.searchDetail = searchDetail;
        function init() {

            vm.place_photos = "";
            var placeId = $routeParams.placeId;
            vm.keywords = $routeParams.keywords;
            APIService
                .searchDetail(placeId)
                .success(function (response) {
                    vm.detail = response.result;
                    console.log(response)
                    // for(var i=0;i < response.result.photos.length - 1;i++){
                        try{
                        vm.place_photos = APIService.getPhotoByPhotoReference(response.result.photos[0].photo_reference);
                        }catch (err){
                        }
                            // .then(function (res) {
                            //     console.log(res.toString());
                            //     // console.log(res.config.url)
                            //     vm.place_photos = res;
                            // });
                    // }
                });
        }

        init();

        function searchDetail() {
            var placeId = $routeParams.placeId;
            console.log(placeId);
        }
    }
})();