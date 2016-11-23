(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteEditController", WebsiteEditController);
    
    function WebsiteEditController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        
        function init() {
            var promise = WebsiteService.findWebsiteById(vm.websiteId);
            promise
                .success(function (response) {
                    vm.website = angular.copy(response);
                    console.log(vm.website);
                })
                .error(function () {
                    console.log("Issue");
                })
            
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (response) {
                    vm.websites = angular.copy(response);
                })
                .error(function () {
                    
                })
                
        }
        init();

        vm.updateWebsite = function updateWebsite(updatedWebsite) {
            console.log("Updating Website");
            if(!updatedWebsite || !updatedWebsite.name){
                vm.error = "Cannot update the website, invalid name";
            }else{
                var promise = WebsiteService.updateWebsite(updatedWebsite._id,updatedWebsite);
                promise
                    .success(function () {
                        $location.url("/user/"+vm.userId+"/website");
                    })
                    .error(function () {
                        vm.error = "Cannot update Website";
                    })
            }
        };

        vm.deleteWebsite = function deleteWebsite(websiteId) {
            var promise = WebsiteService.deleteWebsite(websiteId);
            promise
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website");
                })
                .error(function () {
                    vm.error = "Cannot delete website";
                })
        };
    }
})();