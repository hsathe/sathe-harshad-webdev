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
            vm.pages = angular.copy(PageService.findPageByWebsiteId(vm.websiteId));
        }
        init();

        vm.createPage = createPage;

        function createPage() {
            if(!vm.page || !vm.page.name){
                vm.error = "Check the page name or title";
            }else{
                var result = PageService.createPage(vm.websiteId,vm.page);
                if(result){
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                }else{
                    vm.error = "Failed to create Page";
                }
            }
        }
    }
})();