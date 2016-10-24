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
            vm.widgets = angular.copy(WidgetService.findWidgetsByPageId(vm.pageId));
        }
        init();

        function getSafeHtml(html){
            console.log(html);
            return $sce.trustAsHtml(html);
        }

        vm.getSafeUrl = function getSafeUrl(url) {
            var urlParts = url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url_open = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url_open);
        }
    }
})();