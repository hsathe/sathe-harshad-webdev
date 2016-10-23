(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController",WebsiteListController);
    
    function WebsiteListController($location, $routeParams, WebsiteService) {
        var vm = this;
        console.log("Help!");

        vm.userId = $routeParams.uid;
        console.log("User ID: "+vm.userId);
        function  init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();
    }
})();