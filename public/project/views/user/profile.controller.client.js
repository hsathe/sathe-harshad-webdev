(function () {
    angular
        .module("PlacesApp")
        .controller("ProfileController", ProfileController);
    
    function ProfileController($rootScope, TravelYaarUserService) {
        var vm = this;
        vm.public = [];
        vm.network = [];
        vm.networkRecommendations = 1;
        vm.addRecommendation = addRecommendation;

        function init() {
            console.log("In profile controller");
            vm.userId = $rootScope.currentUser._id;
            vm.user = $rootScope.currentUser;
            
            fetch();
        }
        init();
        
        function fetch() {
            TravelYaarUserService
                .getFilteredFeed(vm.userId)
                .then(
                    function (response) {
                        compilePublicFeed(response.data);
                    },
                    function (err) {
                        vm.public = [];
                    }
                );
            
            TravelYaarUserService
                .getUserFeed(vm.userId)
                .then(
                    function (response) {
                        compileNetworkFeed(response.data);
                    }, function (err) {
                        vm.network = [];
                    }
                );
        }
        
        function compilePublicFeed(data) {
            vm.public.length = 0;
            
            for(var i=data.length-1;i>=0;i--){
                vm.public.push({
                    added : false,
                    error: false,
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
            return vm.public;
        }

        function addRecommendation(hit, viewId){
            TravelYaarUserService
                .addToRecommendations(vm.user._id, hit.place)
                .then(
                    function(success){
                        hit.added = true;
                        hit.error = false;
                        hit.place.totalReco = hit.place.totalReco + 1;
                        vm.user.recommendations.push(hit.place.place_id);
                        if(viewId == 0){
                            for(var i = 0; i < vm.network.length; i++){
                                if(vm.network[i].place.place_id == hit.place.place_id){
                                    vm.network[i].added = true;
                                    vm.network[i].place.totalReco = vm.network[i].place.totalReco + 1;
                                    break;
                                }
                            }
                        }
                        else{
                            for(var j = 0; j < vm.public.length; j++){
                                if(vm.public[j].place.place_id == hit.place.place_id){
                                    vm.public[j].added = true;
                                    vm.public[j].place.totalReco = vm.public[j].place.totalReco + 1;
                                    break;
                                }
                            }
                        }
                    },
                    function(err){
                        hit.added = false;
                        hit.error = true;
                    }
                );
        }

        function compileNetworkFeed(data) {
            vm.network.length = 0;

            for(var i=data.length-1;i>=0;i--){
                vm.network.push({
                    added : false,
                    error: false,
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
            return vm.network;
        }

        vm.toggleView = function(){
            if(vm.networkRecommendations === 0){
                vm.networkRecommendations = 1;
            }
            else{
                vm.networkRecommendations = 0;
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
    }
})();