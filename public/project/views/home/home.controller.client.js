(function () {
    angular
        .module("PlacesApp")
        .controller("HomeController", HomeController);
    
    function HomeController(APIService) {
        console.log("In Home Controller");
        vm = this;
        vm.attractions = [];
        
        vm.search = search;
        function search(keywords) {
            APIService
                .search(keywords)
                .then(function (response) {
                    compileResults(response.data);
                },
                function (err) {
                    vm.attractions = [];
                });
        }
        
        function compileResults(data) {
            vm.attractions.length = 0;
            for(var i=data.results.length - 1; i >=0;i--){
                vm.attractions.push({
                    place_id: data.results[i].place_id,
                    name: data.results[i].name,
                    formatted_address: data.results[i].formatted_address,
                    rating: data.results[i].rating,
                    photo_reference: data.results[i].photo_reference
                });
            }
            return vm.attractions;
        }
        
    }
})();