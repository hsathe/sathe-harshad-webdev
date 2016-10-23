(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);
    
    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.userId = $routeParams.uid;

        var user = UserService.findUserById(vm.userId);

            if(user != null){
                console.log(["Found user",user]);
                vm.user = user;
        }

        vm.updateUser = updateUser;
        
        function updateUser(newUser) {
            var flag = UserService.updateUser(vm.userId, newUser);
            if(flag){
                vm.updateSuccess = "Success! ";
            }else{
                vm.updateError = "Error!";
            }
        }

        vm.deleteUser = deleteUser;

        function deleteUser() {
            var delFlag = UserService.deleteUser(vm.userId);
            if(delFlag){
                vm.deleteSuccess = "Success!";
            }else{
                vm.deleteError = "Error!";
            }
        }
    }
})();