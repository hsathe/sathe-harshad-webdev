(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController",WebsiteListController);
    
    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        console.log("Help");

        var userId = $routeParams.uid;
        vm.websites = WebsiteService.findWebsitesByUser(userId);
    }
})();