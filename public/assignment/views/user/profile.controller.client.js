(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);
    
    function ProfileController($location, $routeParams, UserService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.deleteUser = deleteUser;
        vm.updateUser = updateUser;


        function init() {
            var promise = UserService.findUserById(vm.userId);

            promise
                .success(function (user) {
                    if(user != '0'){
                        console.log(["Found user",user]);
                        vm.user = angular.copy(user);
                    }
                })
                .error(function () {
                })            
        }
        
        init();

        function updateUser(newUser) {
            console.log(newUser);
            var promise = UserService.updateUser(vm.userId, newUser);
            
            promise
                .success(function () {
                    vm.updateSuccess = "Success! ";    
                })
                .error(function () {
                    vm.updateError = "Error!";    
                })
        }

        function deleteUser() {
            var promise = UserService.deleteUser(vm.userId);
            promise
                .success(function () {
                    vm.deleteSuccess = "Success!";
                    $location.url("/login");
                })
                .error(function () {
                    vm.deleteError = "Error!";  
                })
        }
    }
})();