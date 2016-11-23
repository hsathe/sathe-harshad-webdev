(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService){
        var vm = this;
        vm.login = login;


        function login(username,password) {
            // Username and password required to login
            if(!username || !password) {
                vm.error = "No Such User";
            }else{
                var promise = UserService.findUserByCredentials(username,password);
                promise
                    .success(function (user) {
                        if(user == ""){
                            vm.error = "No Such User";
                        }else{
                            $location.url("/user/"+user._id);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    })
            }
        }

        vm.register = function () {
            $location.url("/register");
        }
    }
})();