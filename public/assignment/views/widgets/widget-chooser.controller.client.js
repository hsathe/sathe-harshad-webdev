(function () {
	angular
		.module("WebAppMaker")
		.controller("ChooseWidgetController", ChooseWidgetController);

	function ChooseWidgetController($routeParams, $location, WidgetService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.pageId = $routeParams.pid;
		vm.websiteId = $routeParams.wid;

		vm.addWidget = function (widgetType) {
			var widget = {
				widgetType: widgetType
			};

			WidgetService
				.createWidget(vm.pageId, widget)
				.success(function (response) {
					var widgetId = response._id;
					$location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widgetId);
				})
				.error(function () {
					vm.error = "Unable to create widget";
				})
		};
	}
})();

