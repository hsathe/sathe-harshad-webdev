(function () {
    angular
        .module("WebAppMaker")
        .controller("RegisterController",RegisterController);
    
    function RegisterController($location, UserService, $rootScope) {
        var vm = this;
        
        vm.createUser = function (username,password, verifyPassword) {
            var user = {
                username : username,
                password : password,
                verifyPassword : verifyPassword
            };

            if(!user.username || !user.password || !user.verifyPassword){
                vm.error = "Fields are blanks!";
            }else if(user.password != user.verifyPassword){
                vm.error = "Passwords do not match";
            }else{
                UserService
                    .registerUser(user)
                    .then(
                        function(response){
                            var newUser = response.data;
                            if(newUser && newUser._id) {
                                $rootScope.currentUser = newUser;
                                $location.url("/user/"+ newUser._id);
                            }
                        },
                        function(err){
                            vm.error = "Error! Username already exists.";
                        }
                    );
            }
        };

        vm.cancel = function () {
            $location.url("/login");
        }
    }
})();