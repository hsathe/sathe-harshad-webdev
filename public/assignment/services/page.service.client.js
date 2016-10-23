(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var _newPageId = 600;

        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
            { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
            { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
        ];

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
            _newPageId++;
            var newPage = {
                _id :  _newPageId.toString(),
                name : page.name,
                description : page.description,
                websiteId : websiteId
            };
            pages.push(newPage);
            console.log("New Page Created Successfully");
            return true;
        }
        
        function findPageById(pageId) {
            console.log("Finding Page By Id");
            for(var i in pages){
                if(pages[i]._id === pageId){
                    console.log("Found Page - "+ pages[i]);
                    return pages[i];
                }
            }
            console.log("Page Not Found - "+pageId);
            return false;
        }
        
        function findPageByWebsiteId(websiteId) {
            console.log("Finding Page by WebSite-"+websiteId);
            var results = []
            for(var i in pages){
                if(pages[i].websiteId === websiteId){
                    results.push(pages[i])
                }
            }
            console.log("Found " + results.length + " pages for website ID " + websiteId);
            return results;
        }

        function updatePage(pageId, newPage) {
            console.log("Updating Page-"+pageId);
            var oldPage = findPageById(pageId);
            if(oldPage){
                oldPage.name = newPage.name;
                oldPage.description = newPage.description;
                console.log("Page Updated-"+oldPage);
                return true;
            }
            return false;
        }

        function deletePage(pageId) {
            console.log("Deleting page-"+pageId);
            for(var i in pages){
                if(pages[i]._id === pageId){
                    pages.splice(i,1);
                    console.log("Deleted Page-"+pageId);
                    return true;
                }
            }
            console.log("Unable to delete Page-"+pageId);
            return false;
        }
    }
})();