(function () {
    angular
        .module("PlacesApp")
        .factory("APIService", APIService);

    function APIService($http) {
        var api = {
            search: search,
            getPhotoByPhotoReference:getPhotoByPhotoReference,
            searchDetail:searchDetail,
            getGoogleKey: getGoogleKey
        };

        return api;
        
        function getGoogleKey() {
            return $http.get("/api/key");
        }
        function search(keywords, key) {
            if(!key){
                // key = "AIzaSyCuNyzGJzJtVIYcOfJddT7cagW011fsioM";
                key = "AIzaSyBausENaGVRf31dW-ph0Wi9sk1vFBSRCzo";
            }

            var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
            console.log(url);

            return $http.get(url, {
                params: {
                    key: key,
                    query: (keywords) ? 'attractions+in+' + keywords : 'attractions+in+Boston'
                }
            });

        }

        function getPhotoByPhotoReference(photoReference, key) {
            if(!key){
                // key = "AIzaSyCuNyzGJzJtVIYcOfJddT7cagW011fsioM";
                key = "AIzaSyBausENaGVRf31dW-ph0Wi9sk1vFBSRCzo";
            }
            var Photokey = key;
            var photoURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+photoReference+"&key="+Photokey;
            console.log("Getting Image: "+photoURL);

            return photoURL;
        }

        function searchDetail(placeId) {
            // var key = "AIzaSyCuNyzGJzJtVIYcOfJddT7cagW011fsioM";
            var key = "AIzaSyBausENaGVRf31dW-ph0Wi9sk1vFBSRCzo";
            var url = "https://maps.googleapis.com/maps/api/place/details/json?";

            return $http.get(url,{
                params:{
                    placeid: placeId,
                    key: key
                }
            })
        }
    }
})();