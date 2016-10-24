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
        

        function init() {
            vm.widgets = angular.copy(WidgetService.findWidgetsByPageId(vm.pageId));
        }
        init();

        vm.getSafeHtml = function getSafeHtml(widget) {
            return $sce.trustAsHtml(widget.text);
        }

        vm.getSafeUrl = function getSafeUrl(widget) {
            var urlParts = widget.url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }
    }
})();