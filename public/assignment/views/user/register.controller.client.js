(function () {
    angular
        .module("WebAppMaker")
        .controller("RegisterController",RegisterController);
    
    function RegisterController($location, UserService) {
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
                    .createUser(user)
                    .success(function (response) {
                        var newUser = response;
                        if(newUser){
                            $location.url("/user/"+newUser._id);
                        }
                    })
                    .error(function (error) {
                    })
            }
        };

        vm.cancel = function () {
            $location.url("/login");
        }
    }
})();