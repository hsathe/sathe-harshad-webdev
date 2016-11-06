(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    
    function WidgetService($http) {
        console.log("In WidgetService");

        var api = {
            createWidget: createWidget,
            findWidgetsByPageId: findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget: updateWidget,
            deleteWidget: deleteWidget,
            sort: sort
        };

        return api;

        function createWidget(pageId, widget) {
            console.log("createWidget for page ID - ", pageId);
            widget['pageId'] = pageId;
            var url = "/api/page/" + pageId + "/widget";
            return $http.post(url, widget);
        }
        
        function findWidgetsByPageId(pageId) {
            console.log("findWidgetsByPageId - " + pageId);
            var url = "/api/page/" + pageId + "/widget";
            return $http.get(url);
        }

        function findWidgetById(widgetId) {
            console.log("findWidgetById - " + widgetId);
            var url = "/api/widget/" + widgetId;
            return $http.get(url);
        }

        function updateWidget(widgetId, widget) {
            console.log("updateWidget - ", widgetId);
            var url = "/api/widget/" + widgetId;
            return $http.put(url,widget);
        }

        function deleteWidget(widgetId) {
            console.log("deleteWebsite - " + widgetId);
            var url = "/api/widget/" + widgetId;
            return $http.delete(url);
        }

        function sort(pageId,start,end){
            var url="/api/page/"+pageId+"/widget?start=START&end=END";
            url=url
                .replace("START",start)
                .replace("END",end);
            $http.put(url);
        }
    }
})();