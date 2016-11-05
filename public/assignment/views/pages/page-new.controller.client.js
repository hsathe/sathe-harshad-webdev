(function () {
    angular
        .module("WebAppMaker")
        .controller("NewPageController", NewPageController);
    
    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        console.log("Hi From Page Controller");
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        function  init() {
            var promise = PageService.findPageByWebsiteId(vm.websiteId);
            promise
                .success(function (response) {
                    vm.pages = angular.copy(response);
                })
                .error(function () {

                })
        }
        init();

        vm.createPage = createPage;

        function createPage() {
            if(!vm.page || !vm.page.name){
                vm.error = "Check the page name or title";
            }else{
                var promise = PageService.createPage(vm.websiteId,vm.page);

                promise
                    .success(function () {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    })
                    .error(function () {
                        vm.error = "Failed to create Page";
                    })
            }
        }
    }
})();