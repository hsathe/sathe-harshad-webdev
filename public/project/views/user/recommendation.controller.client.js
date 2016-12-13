(function () {
    angular
        .module("PlacesApp")
        .controller("RecommendationController", RecommendationController);
    
    function RecommendationController($sce, $location, $routeParams, $rootScope, TravelYaarUserService) {
        var vm = this;
        vm.recommendations = [];
        vm.seeButton = false;
        function init() {
            if($routeParams.uid){
                vm.userId  = $routeParams.uid;
                if($routeParams.otherid){
                    vm.otherUserId = $routeParams.otherid;
                }else{
                    vm.otherUserId = $rootScope.currentUser._id;
                }

                (function(){
                    TravelYaarUserService
                        .findUserById($routeParams.uid)
                        .then(
                            function(user){
                                vm.user = user.data;
                                vm.seeButton = true;
                                fetchForOtherUser();
                            },
                            function(err){
                                vm.user = $rootScope.currentUser;
                                vm.seeButton = false;
                                fetchForMe();
                            }
                        );
                })();
            }else{
                vm.userId = $rootScope.currentUser._id;
                vm.otherUserId = $rootScope.currentUser._id;
                vm.user = $rootScope.currentUser;
                vm.seeButton = false;
                fetchForMe();
            }

        }

        function fetchForMe() {
            TravelYaarUserService
                .getRecommendationsForUser(vm.userId)
                .then(
                    function (response) {
                        compileResults(response.data);
                    },
                    function (err) {
                        vm.recommendations = [];
                    }
                )
        }
        
        function fetchForOtherUser() {
            TravelYaarUserService
                .getRecommendationsForUser(vm.userId)
                .then(
                    function (otherRecos) {
                        TravelYaarUserService.getRecommendationsForUser(vm.otherUserId)
                            .then(
                                function (myReco) {
                                    var his =  compilePseudoResults(otherRecos.data);
                                    var mine = compilePseudoResults(myReco.data);

                                    if(his.length != 0 && mine.length != 0){
                                        for(var i=0; i< his.length;i++){
                                            for(var j=0;j<mine.length;j++){
                                                if(his[i].place_id == mine[j].place_id){
                                                    his[i].added = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    vm.recommendations = his;
                                },
                                function (err) {
                                    compileResults(otherRecos.data);
                                }
                            );
                    },
                    function (err) {
                        vm.recommendations = [];
                    }
                );
        }

        init();
        
        function compilePseudoResults(data) {
            var f = [];
            for(var i = data.length - 1;i >=0;i--){
                f.push({
                    added : false,
                    error : false,
                    place: {
                        _id: data[i]._id,
                        name: data[i].name.replace(/(\r\n|\n|\r)/gm,""),
                        place_id: data[i].place_id,
                        formatted_address:data[i].formatted_address.replace(/(\r\n|\n|\r)/gm,""),
                        totalReco: data[i].recommendedBy.length,
                        photo_reference: data[i].photo_reference,
                        rating: data[i].rating
                    }
                });
            }
            return f;
        }
        
        function compileResults(data) {
            vm.recommendations.length = 0;
            for(var i = data.length - 1;i >=0;i--){
                vm.recommendations.push({
                    added : false,
                    error : false,
                    place: {
                        _id: data[i]._id,
                        name: data[i].name,
                        place_id: data[i].place_id,
                        formatted_address:data[i].formatted_address,
                        totalReco: data[i].recommendedBy.length,
                        photo_reference: data[i].photo_reference,
                        rating: data[i].rating
                    }
                });
            }
            return vm.recommendations;
        }
        
        vm.addRecommendation = addRecommendation;
        function addRecommendation(reco) {
            TravelYaarUserService
                .addToRecommendations(vm.otherUserId, reco.place)
                .then(
                    function (success) {
                        reco.added = true;
                        reco.error = false;
                        reco.place.totalReco = reco.place.totalReco + 1;
                    },
                    function (err) {
                        reco.added = false;
                        reco.error = true;
                    }
                );
        }

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
    }
})();