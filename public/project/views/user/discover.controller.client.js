(function () {
    angular
        .module("PlacesApp")
        .controller("DiscoverController", DiscoverController);

    function DiscoverController(APIService) {
        var vm = this;
        
        function init(){
            console.log("In Discover Controller");
        }
        init();

        vm.search = search;

        function search(keywords) {
            console.log("Searching for the attractions in "+keywords);
            APIService
                .search(keywords)
                .then(function (results) {
                    console.log(results);
                })
        }


    }
})();