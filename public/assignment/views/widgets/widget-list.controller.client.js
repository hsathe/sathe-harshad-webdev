(function () {
    angular
        .module("WebAppMaker")
        .controller("ListWidgetController", ListWidgetController);

    function ListWidgetController($sce, $routeParams, WidgetService) {
        var vm = this;
        console.log("In ListWidgetController");
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.getSafeHtml = getSafeHtml;
        function init() {
            var promise = WidgetService.findWidgetsByPageId(vm.pageId);
            promise
                .success(function (response) {
                    console.log("Success!!!!!");
                    vm.widgets = angular.copy(response);
                })
                .error(function () {
                    
                })
        }
        init();

        function getSafeHtml(html){
            console.log("In GetSafe HTML="+html);
            return $sce.trustAsHtml(html.text);
        }

        vm.getSafeUrl = function getSafeUrl(url) {
            var urlParts = url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url_open = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url_open);
        }
    }
})();