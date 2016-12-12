(function () {
	angular
		.module("WebAppMaker")
		.controller("EditWidgetController", EditWidgetController);

	function EditWidgetController($location, $routeParams, WidgetService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.pageId = $routeParams.pid;
		vm.websiteId = $routeParams.wid;
		vm.widgetId = $routeParams.wgid;

		function init(){
			var promise = WidgetService.findWidgetById(vm.widgetId);
			promise
				.success(function (response) {
					vm.widget = angular.copy(response);
				})
				.error(function (err) {
					console.log("Print Error"+err);
				})
		}
		init();

		vm.updateWidget = function updateWidget(widget){

			if(widget.widgetType === "HEADER"){
				updateHeading(widget);
			}else if(widget.widgetType === "IMAGE"){
				updateImage(widget);
			}else if(widget.widgetType === "YOUTUBE") {
				updateYoutube(widget);
			}else if(widget.widgetType === "TEXT"){
				updateText(widget);
			}else if(widget.widgetType === "HTML"){
				updateHTML(widget);
			}
		};
		
		function updateHeading(widget) {
			if(!widget.text){
				vm.error = "Text field is blank";
			}else if(!widget.name){
				vm.error = "Name is required.";
			}else{
				if(!widget.size){
					widget.size = 1;
				}
				WidgetService
                    .updateWidget(vm.widgetId, widget)
					.success(function (res) {
						console.log("Updated Successfully! "+res);
						$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
					})
					.error(function (err) {
                        console.log(err);
						vm.error = "Unable to update the widget";
					})
			}
		}

		function updateYoutube(widget) {
			if(!widget.url){
				vm.error = "URL field is blank";
			}else if(!widget.name){
				vm.error = "Name is required.";
			}else{
				if(!widget.width){
					widget.width = "100%";
				}
				WidgetService
					.updateWidget(vm.widgetId, widget)
					.success(function (response) {
						$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
					})
					.error(function () {
						vm.error = "Unable to update the widget";
					})
			}
		}

		function updateHTML(widget) {
			if(!widget.text){
				vm.error = "Text field is blank";
			}else if(!widget.name){
				vm.error = "Name is required.";
			}else{
				WidgetService
					.updateWidget(vm.widgetId, widget)
					.success(function (response) {
						$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
					})
					.error(function () {
						vm.error = "Unable to update the widget";
					})
			}
		}

		function updateText(widget) {
			if(!widget.rows && !widget.formatted){
				vm.error = "No of rows and formatted option is mandatory";
			}else if(!widget.name){
				vm.error = "Name is required.";
			}else{
				WidgetService
					.updateWidget(vm.widgetId, widget)
					.then(function (response) {
						$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
					}, function (err) {
						vm.error = "Widget cannot be updated";
					});
			}
		}

		function updateImage(widget) {
			if(!widget.url){
				vm.error = "URL field is blank";
			}else if(!widget.name){
				vm.error = "Name is required.";
			}else{
				if(!widget.width){
					widget.width = "100%";
				}
				WidgetService
					.updateWidget(vm.widgetId, widget)
					.success(function (response) {
						$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
					})
					.error(function () {
						vm.error = "Unable to update the widget";
					})
			}
		}

		vm.deleteWidget = function deleteWidget(){
			var promise = WidgetService.deleteWidget(vm.widgetId);
			
			promise
				.success(function () {
					$location.url("/user/" + vm.userId +
						"/website/" + vm.websiteId +
						"/page/" + vm.pageId +
						"/widget");
				})
				.error(function () {
					vm.error = "Widget could not be deleted.";
				})
		}

        vm.selectWidget= function selectWidget() {
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
        }
	}
})();

