(function () {
    angular
        .module("PlacesApp")
        .controller("ProfileController", ProfileController);
    
    function ProfileController($rootScope, TravelYaarUserService) {
        var vm = this;
        function init() {
            console.log("In profile controller");
            vm.userId = $rootScope.currentUser._id;
            vm.user = $rootScope.currentUser;
        }
        init();
    }
})();