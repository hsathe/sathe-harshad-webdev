(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService, $rootScope){
        var vm = this;
        vm.login = login;


        function login(username,password) {
            UserService
                .login(username,password)
                .then(
                    function (response) {
                        var currentUser = response.data;
                        
                        if(currentUser && currentUser._id){
                            $rootScope.currentUser = currentUser;
                            $location.url("/user/"+currentUser._id);
                        }else{
                            vm.error = "Could not login!";
                        }
                    },
                    function (error) {
                        vm.error = "User not found!";
                    }
                );
        };

        vm.register = function () {
            $location.url("/register");
        }
    }
})();