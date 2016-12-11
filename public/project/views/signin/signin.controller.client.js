(function () {
    angular
        .module("PlacesApp")
        .controller("SignInController", SignInController);

    function SignInController($location, TravelYaarUserService, $rootScope) {
        console.log("SignInController");
        var vm = this;
        vm.signin = function (email, password) {
            if(!email || !password){
                vm.signInError = "All fields are required";
            }else{
                var user = {
                    username: email,
                    password: password
                };
                TravelYaarUserService
                    .signIn(user)
                    .then(
                        function (response) {
                            var currentUser = response.data;
                            console.log("SignIn returned success");
                            if(currentUser && currentUser._id){
                                $rootScope.currentUser = currentUser;
                                $location.url("/profile");
                            }else{
                                vm.signInError = "Unable to login!";
                            }
                        }, function (error) {
                            vm.signInError = "Credentials are not matching";
                        }
                    );
            }
        };
    }
})();