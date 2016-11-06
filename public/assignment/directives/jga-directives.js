(function () {
    angular
        .module("jgaDirectives",[])
        .directive("sortable", sortable);
    
    function sortable (){
        var start = -1;
        var end = -1;
        function linker(scope, element, attributes) {
            console.log(element);
            console.log("Linker!!!!!");
            element = $(element);
            element.sortable({
                axis : 'y',
                start: function (event, ui) {
                    start = ui.item.index();
                },
                stop: function (event, ui) {
                    end = ui.item.index();
                    scope.sortableController.sort(start,end);
                }
            });
        }
        return {
            scope: {},
            link: linker,
            controller: sortableController,
            controllerAs: 'sortableController'
        }
    }
    
    function sortableController($routeParams, WidgetService) {
        var vm = this;
        vm.sort = sort;
        console.log($routeParams);
        vm.pageId=$routeParams['pid'];
        function sort(start, end) {
            WidgetService.sort(vm.pageId, start, end);
        }
    }
})();