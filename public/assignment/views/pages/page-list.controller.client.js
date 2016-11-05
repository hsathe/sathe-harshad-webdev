(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController",PageListController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        console.log("PageList Controller!");
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        function init() {
            var promise = PageService.findPageByWebsiteId(vm.websiteId);
            promise
                .success(function (response) {
                    vm.pages = response;
                })
                .error(function () {
                    
                })
        }
        init();
    }
})();