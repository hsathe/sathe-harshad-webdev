(function () {
    angular
        .module("PlacesApp")
        .controller("AdminController", AdminController);
    
    function AdminController($route, $location, $rootScope, TravelYaarUserService) {
        var vm = this;
        vm.userResults = [];
        
        function init() {
            console.log("In AdminController");
            TravelYaarUserService
                .getAllUsers()
                .then(
                    function (response) {
                        compileResults(response.data);
                    },
                    function (err) {
                        vm.userResults = [];
                    }
                )
        }
        init();

        function compileResults(data) {
            vm.userResults.length = 0;
            for(var i = data.length - 1; i>=0; i--){
                vm.userResults.push({
                    _id: data[i]._id,
                    name: data[i].firstName.concat(" ").concat(data[i].lastName),
                    noOfFollowers: data[i].followers.length,
                    noOfFollowing: data[i].following.length,
                    noOfRecommendations: data[i].recommendations.length
               });
            }
            return vm.userResults;
        }

        vm.deleteUser = deleteUser;

        function deleteUser(userId) {
            TravelYaarUserService
                .deleteUser
                .then(
                    function (success) {
                        $route.reload();
                    }
                );
        };

        vm.logout = logout;

        function logout() {
            TravelYaarUserService
                .signout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    }
                );
        }
    }
})();