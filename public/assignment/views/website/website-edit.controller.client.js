(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteEditController", WebsiteEditController);
    
    function WebsiteEditController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        
        function init() {
            vm.website = angular.copy(WebsiteService.findWebsiteById(vm.websiteId));
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();

        vm.updateWebsite = function updateWebsite(updatedWebsite) {
            console.log("Updating Website");
            if(!updatedWebsite || !updatedWebsite.name){
                vm.error = "Cannot update the website, invalid name";
            }else{
                var editedWebsite = WebsiteService.updateWebsite(updatedWebsite._id,updatedWebsite);
                if(editedWebsite){
                    $location.url("/user/"+vm.userId+"/website");
                }else{
                    vm.error = "Cannot update Website";
                }
            }
        };


        vm.deleteWebsite = function deleteWebsite(websiteId) {
            var deleteFlag = WebsiteService.deleteWebsite(websiteId);
            if(deleteFlag){
                $location.url("/user/"+vm.userId+"/website");
            }else{
                vm.error = "Cannot delete website";
            }
        };
    }
})();