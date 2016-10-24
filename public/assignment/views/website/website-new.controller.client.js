(function () {
    angular
        .module("WebAppMaker")
        .controller("NewWebsiteController", NewWebsiteController);

    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        console.log("Hi from NewWebSiteController!");
        
        vm.userId = $routeParams.uid;

        function  init() {
            vm.websites = angular.copy(WebsiteService.findWebsitesByUser(vm.userId));
        }
        init();

        vm.createWebsite = function createWebsite(name, description){
            console.log("Creating website");
            if(!name){
                vm.error = "Website cannot be blank!";
            }else{
                var newWebSiteObj = {
                    name : name,
                    description: description
                };

                var webSite = WebsiteService.createWebsite(vm.userId,newWebSiteObj);

                if(webSite){
                    $location.url("/user/"+vm.userId+"/website")
                }else{
                    vm.error = "Unable to create website";
                }
            }
        }
    }
})();