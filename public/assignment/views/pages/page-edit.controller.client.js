(function () {
    angular
        .module("WebAppMaker")
        .controller("EditPageController", EditPageController);
    
    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        console.log("Hi From Edit Page Controller");
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        function  init() {
            // vm.pages = angular.copy(PageService.findPageByWebsiteId(vm.websiteId));
            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (response) {
                    vm.pages = angular.copy(response);
                })
                .error(function () {

                })
            PageService
                .findPageById(vm.pageId)
                .success(function (response) {
                    vm.page = angular.copy(response);
                })
                .error(function () {

                })
        }
        init();

        vm.updatePage = function updatePage() {
            console.log("Updating Website");
            if(!vm.page || !vm.page.name){
                vm.error = "Cannot update the website, invalid name";
            }else{
                var promise = PageService.updatePage(vm.pageId,vm.page);
                promise
                    .success(function () {
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    })
                    .error(function () {
                        vm.error = "Cannot update Website";
                    })
            }
        };


        vm.deletePage = function deletePage() {
            var promise = PageService.deletePage(vm.pageId);
            promise
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                })
                .error(function () {
                    vm.error = "Cannot delete website";
                })
        };
    }
})();