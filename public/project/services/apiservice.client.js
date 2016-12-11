(function () {
    angular
        .module("PlacesApp")
        .factory("APIService", APIService);

    function APIService($http) {
        var api = {
            search: search,
            getPhotoByPhotoReference:getPhotoByPhotoReference,
            searchDetail:searchDetail
        };

        return api;

        function getKey() {
            return $http.get("/api/googlePlaces");
        }

        function search(keywords) {

            var key = 'AIzaSyABe0JiGEryUQQsl_MLJPtDt-9IaKz5WRQ';
            // var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key="+key+"&query="+keywords;
            var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
            console.log(url);


            // var req = {
            //     method: 'GET',
            //     url: url,
            //     heders: {'Access-Control-Allow-Origin': '*'}
            // };
            //
            // $http(req)
            //     .success(function(response){
            //         console.log(response);
            //     })
            //     .error(function(err){
            //         console.log(err);
            // });

            return $http.get(url, {
                params: {
                    key: key,
                    query: (keywords) ? 'attractions+in+' + keywords : 'attractions+in+Boston'
                }
            });
        }

        function getPhotoByPhotoReference(photoReference) {
            var Photokey = "AIzaSyAjaKcWRwi4RTt67BLdh6uZ0dMGk5zdArg";
            // var photoURL = "https://maps.googleapis.com/maps/api/place/photo?photoreference=" + photoReference + "&key=" + Photokey;
            // var photoURL = "https://maps.googleapis.com/maps/api/place/photo?";
            // return $http.get(photoURL,{
            //     params: {
            //         photoreference: photoReference,
            //         key: Photokey
            //     }
            // });

            var photoURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key="+Photokey;
            console.log("Getting Image: "+photoURL);

            return $http.get(photoURL);
        }

        function searchDetail(placeId) {
            var key = "AIzaSyAjaKcWRwi4RTt67BLdh6uZ0dMGk5zdArg";
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