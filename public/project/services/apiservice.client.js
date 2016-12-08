(function () {
    angular
        .module("PlacesApp")
        .factory("APIService", APIService);
    
    function APIService($http) {
        var api = {
            search: search
        };
        
        return api;

        function getKey() {
            return $http.get("/api/googlePlaces");
        }
        
        function search(keywords) {

            var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
            console.log("Searching for "+url);
            var key = 'AIzaSyABe0JiGEryUQQsl_MLJPtDt-9IaKz5WRQ';
            return $http.get(url,{
               params: {
                   key : key,
                   query: (keywords) ? 'attractions+in+' + keywords : 'attractions+in+Boston'
               }
            });
        }
    }
})();