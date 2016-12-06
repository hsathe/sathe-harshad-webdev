(function () {
    angular
        .module("PlacesApp")
        .controller("HomeController", HomeController);
    
    function HomeController() {
        console.log("In Home Controller");
    }
})();