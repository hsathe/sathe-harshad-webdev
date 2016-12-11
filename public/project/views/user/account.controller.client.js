(function () {
    angular
        .module("PlacesApp")
        .controller("AccountController", AccountController);
    
    function AccountController($routeParams, $location, $rootScope, TravelYaarUserService) {
        console.log("In Account Controller");

        var vm = this;

        if($routeParams.uid){
            vm.userId = $routeParams.uid;
        }else{
            vm.userId = $rootScope.currentUser._id;
        }
        
        function init() {
            console.log(vm.user);
            TravelYaarUserService
                .findUserById(vm.userId)
                .then(function (response) {
                    var currentUser = response.data;
                    if(currentUser && currentUser._id){
                        vm.user = angular.copy(response.data);
                    }
                });
        }
        init();
        
        vm.updateUser = updateUser;
        
        function updateUser(newUser) {
            TravelYaarUserService
                .updateUser(vm.userId, newUser)
                .then(
                    function () {
                        vm.updateSuccess = "Account updated!";
                    },
                    function () {
                        vm.updateError = "Failed to update user";
                    }
                );
        }
        
        vm.makeAdmin = makeAdmin;
        
        function makeAdmin(newUser) {
            newUser.role = "admin";
            TravelYaarUserService
                .updateUser(newUser)
                .then(
                    function () {
                        vm.updateSuccess = "User is now admin!";
                    },
                    function () {
                        vm.updateError = "Unable to make the user an admin";
                    }
                );
        }
        
        vm.logout = logout;
        
        function logout() {
            TravelYaarUserService
                .signout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    }
                );
        }
    }
})();