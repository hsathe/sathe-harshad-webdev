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
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
            vm.page = PageService.findPageById(vm.pageId);
        }
        init();

        vm.updatePage = function updatePage() {
            console.log("Updating Website");
            if(!vm.page || !vm.page.name){
                vm.error = "Cannot update the website, invalid name";
            }else{
                var editedPage = PageService.updatePage(vm.pageId,vm.page);
                if(editedPage){
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                }else{
                    vm.error = "Cannot update Website";
                }
            }
        };


        vm.deletePage = function deletePage() {
            var deleteFlag = PageService.deletePage(vm.pageId);
            if(deleteFlag){
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }else{
                vm.error = "Cannot delete website";
            }
        };
    }
})();