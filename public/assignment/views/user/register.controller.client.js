(function () {
    angular
        .module("WebAppMaker")
        .controller("RegisterController",RegisterController);
    
    function RegisterController($location, UserService) {
        vm = this;
        
        vm.createUser = function (username,password, verifyPassword) {
            var user = {
                username : username,
                password : password,
                verifyPassword : verifyPassword
            };

            var id = UserService.createUser(user);

            if(id != -1){
                $location.url("/user/"+id);
            }else{
                vm.error = "Error, please check username and password."
            }
        };

        vm.cancel = function () {
            $location.url("/login");
        }
    }
})();