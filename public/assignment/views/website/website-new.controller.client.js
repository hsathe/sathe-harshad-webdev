(function () {
    angular
        .module("WebAppMaker")
        .controller("NewWebsiteController", NewWebsiteController);

    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        console.log("Hi from NewWebSiteController!");
        
        vm.userId = $routeParams.uid;

        function  init() {
            // vm.websites = angular.copy(WebsiteService.findWebsitesByUser(vm.userId));
            var promise = angular.copy(WebsiteService.findWebsitesByUser(vm.userId));
            promise
                .success(function (response) {
                    vm.websites = response;
                })
                .error(function () {

                })
        }
        init();

        vm.createWebsite = function createWebsite(name, description){
            console.log("Creating website");
            if(!name){
                vm.error = "Website name cannot be blank!";
            }else{
                var newWebSiteObj = {
                    name : name,
                    description: description
                };

                var promise = WebsiteService.createWebsite(vm.userId,newWebSiteObj);
                    
                promise
                    .success(function (response) {
                        $location.url("/user/"+vm.userId+"/website")
                    })
                    .error(function () {
                        vm.error = "Unable to create website";
                    })
            }
        }
    }
})();