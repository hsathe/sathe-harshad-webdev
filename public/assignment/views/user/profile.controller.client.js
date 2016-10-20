(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);
    
    function ProfileController($routeParams, UserService) {
        var vm = this;
        var userId = $routeParams.uid;

        var user = UserService.findUserById(userId);

            if(user != null){
                console.log(["Found user",user]);
                vm.user = user;
        }
    }
})();