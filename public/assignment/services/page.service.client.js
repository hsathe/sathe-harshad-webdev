(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService($http) {

        var api = {
            createPage : createPage,
            findPageByWebsiteId : findPageByWebsiteId,
            findPageById : findPageById,
            updatePage : updatePage,
            deletePage : deletePage
        };

        return api;

        function createPage(websiteId, page) {
            console.log("Creating a Page-"+page);
            var newPage = {
                name: page.name,
                description: page.description,
                websiteId: websiteId
            };
            return $http.post("/api/user/" + websiteId + "/page",newPage);
        }
        
        function findPageById(pageId) {
            console.log("Finding Page By Id");
            return $http.get("/api/page/" + pageId);
            
        }
        
        function findPageByWebsiteId(websiteId) {
            console.log("Finding Page by WebSite-"+websiteId);
            return $http.get("/api/website/"+ websiteId +"/page");
        }

        function updatePage(pageId, newPage) {
            console.log("Updating Page-"+pageId);
            return $http.put("/api/page/" + pageId, newPage);
        }

        function deletePage(pageId) {
            console.log("Deleting page-"+pageId);
            return $http.delete("/api/page/" + pageId);
        }
    }
})();