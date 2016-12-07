(function () {
    angular
        .module("PlacesApp")
        .controller("ConnectionsController",ConnectionsController);
    
    function ConnectionsController($location, $route, $routeParams, $rootScope, TravelYaarUserService) {
        var vm = this;
        vm.userResults = [];
        vm.following = [];
        vm.followers = [];
        vm.allUsers = 0;
        
        function getConnections() {
            TravelYaarUserService
                .getUsersToFollow(vm.userId)
                .then(
                    function (response) {
                        buildResults(response.data);
                    },
                    function (err) {
                        vm.userResults = [];
                    }
                );
            
            TravelYaarUserService.getFollowersForUser(vm.userId)
                .then(
                    function (allFollowers) {
                        TravelYaarUserService
                            .getFollowingForUser(vm.userId)
                            .then(
                                function (allFollowing) {
                                    var followers = compilePseudoFollowers(allFollowers.data);
                                    var following = compilePseudoFollowing(allFollowing.data);

                                    if(followers.length != 0 && following.length != 0){
                                        for(var i = 0; i < followers.length; i++){
                                            for(var j = 0; j < following.length; j++){
                                                if(followers[i].user._id == following[j].user._id){
                                                    followers[i].following = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    vm.followers = followers;
                                    vm.following = following;
                                },
                                function (err) {
                                    vm.following;
                                    compileFollowers(allFollowers.data);
                                }
                            );
                    },
                    function (err) {
                        vm.followers = [];
                        TravelYaarUserService
                            .getFollowingForUser(vm.userId)
                            .then(
                                function (response) {
                                    compileFollowing(response.data);
                                },
                                function (err) {
                                    vm.following = [];
                                }
                            );
                    }
                );
        }
        function init(){
            console.log("In ConnectionsController");
            if($routeParams.searchView){
                vm.allUsers = parseInt($routeParams.searchView);
            }
            
            if($routeParams.uid){
                vm.userId = $routeParams.uid;
                (function () {
                    TravelYaarUserService
                        .findUserById(vm.userId)
                        .then(
                            function (user) {
                                vm.user = user.data;
                            }, function (err) {
                                vm.user = $rootScope.currentUser;
                            }
                        );
                })();
            }else{
                vm.userId = $rootScope.currentUser._id;
                vm.user = $rootScope.currentUser;
            }

            getConnections();
        }
        init();

        function compilePseudoFollowers(data){
            var f = [];
            for (var i = data.length - 1; i >= 0; i--) {
                f.push({
                    following: false,
                    error: false,
                    user: {
                        _id: data[i]._id,
                        name: data[i].firstName.concat(" ").concat(data[i].lastName),
                        noOfFollowers: data[i].followers.length,
                        noOfFollowing: data[i].following.length,
                        noOfRecommendations: data[i].recommendations.length
                    }
                });
            }
            return f;
        }

        function compilePseudoFollowing(data){
            var f = [];
            for (var i = data.length - 1; i >= 0; i--) {
                f.push({
                    error: false,
                    user: {
                        _id: data[i]._id,
                        name: data[i].firstName.concat(" ").concat(data[i].lastName),
                        noOfFollowers: data[i].followers.length,
                        noOfFollowing: data[i].following.length,
                        noOfRecommendations: data[i].recommendations.length
                    }
                });
            }
            return f;
        }

        function compileFollowers(data){
            vm.followers.length = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                vm.followers.push({
                    following: false,
                    error: false,
                    user: {
                        _id: data[i]._id,
                        name: data[i].firstName.concat(" ").concat(data[i].lastName),
                        noOfFollowers: data[i].followers.length,
                        noOfFollowing: data[i].following.length,
                        noOfRecommendations: data[i].recommendations.length
                    }
                });
            }
            return vm.followers;
        }

        function compileFollowing(data){
            vm.following.length = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                vm.following.push({
                    error: false,
                    user: {
                        _id: data[i]._id,
                        name: data[i].firstName.concat(" ").concat(data[i].lastName),
                        noOfFollowers: data[i].followers.length,
                        noOfFollowing: data[i].following.length,
                        noOfRecommendations: data[i].recommendations.length
                    }
                });
            }
            return vm.following;
        }

        function buildResults(data){
            vm.userResults.length = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                vm.userResults.push({
                    error: false,
                    data: {
                        _id: data[i]._id,
                        name: data[i].firstName.concat(" ").concat(data[i].lastName),
                        noOfFollowers: data[i].followers.length,
                        noOfFollowing: data[i].following.length,
                        noOfRecommendations: data[i].recommendations.length
                    }
                });
            }
            return vm.userResults;
        }

        vm.follow = function(user){
            TravelYaarUserService
                .addToFollowing(vm.userId, user)
                .then(
                    function(success){
                        $route.reload();
                    },
                    function(err){
                        user.error = true;
                    }
                );
        };

        vm.unfollow = function(followingId){
            TravelYaarUserService
                .removeFromFollowing(vm.userId, followingId)
                .then(
                    function(success){
                        $route.reload();
                    },
                    function(err){
                        vm.updateError = "Could not unfollow the user.";
                    }
                );
        };
        // ToDo: Add a function
        vm.viewReco = 0;

        vm.toggleView = function(){
            if(vm.allUsers === 0){
                vm.allUsers = 1;
            }
            else{
                vm.allUsers = 0;
            }
        };
        
        vm.logout = function(){
            TravelYaarUserService
                .signout()
                .then(
                    function(response){
                        $rootScope.currentUser = null;
                        $location.url("/");
                    }
                );
        }

        vm.changeRoute = function(){
            if(vm.allUsers === 0){
                if($routeParams.uid){
                    $location.url("/connections/" + $routeParams.uid + "/view/1");
                }
                else{
                    $location.url("/connections/view/1");
                }
            }
            else{
                if($routeParams.uid){
                    $location.url("/connections/" + $routeParams.uid);
                }
                else{
                    $location.url("/connections");
                }
            }
        };
    }
})();