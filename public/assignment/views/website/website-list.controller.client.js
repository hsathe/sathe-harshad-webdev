(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController",WebsiteListController);
    
    function WebsiteListController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        
        console.log("User ID: "+vm.userId);
        function  init() {
            var promise = WebsiteService.findWebsitesByUser(vm.userId);
            promise
                .success(function (response) {
                    vm.websites = response;
                })
                .error(function () {
                    
                })
        }
        init();
        
        vm.editWebsite = function editWebsite(wID) {
            vm.websiteId = wID;
            $location.url("/user/" + vm.userId + "/website/" + wID);
        };
        
    }
})();