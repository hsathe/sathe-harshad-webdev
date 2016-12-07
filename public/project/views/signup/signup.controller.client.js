(function () {
    angular
        .module("PlacesApp")
        .controller("SignUpController", SignUpController);
    
    function SignUpController($location, $rootScope, TravelYaarUserService) {
        console.log("SignUpController");
        var vm = this;
        vm.createUser = createUser;
        
        function createUser(email, password, confirmPassword, firstName, lastName) {
            var user = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            };
            
            if(!user.email || !user.password || !confirmPassword || !user.firstName || !user.lastName){
                vm.signUpError = "Please fill all required fields";
            }
            else if(user.password != confirmPassword){
                vm.signUpError = "Passwords do not match";
            }else{
                TravelYaarUserService
                    .signUp(user)
                    .then(
                        function (result) {
                            var newUser = result.data;
                            if(newUser && newUser._id){
                                $rootScope.currentUser = newUser;
                                $location.url("/profile");
                            }
                        },function (err) {
                            vm.signUpError = "Unable to create new user! User already Exists...";
                        }
                    );
            }
        }
    }
})();