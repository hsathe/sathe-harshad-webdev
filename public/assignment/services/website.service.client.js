(function(){
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService($http){
        console.log("In Website Service");

        var api = {
            createWebsite : createWebsite,
            findWebsitesByUser : findWebsitesByUser,
            findWebsiteById : findWebsiteById,
            updateWebsite : updateWebsite,
            deleteWebsite : deleteWebsite
        };

        return api;

        function createWebsite(userId, newWebsite) {
            console.log('Creating website for user '+userId);
            newWebsite['developerId'] = userId;
            return $http.post("/api/user/"+userId+"/website", newWebsite);
        }
        function findWebsiteById(websiteId) {
            console.log("Finding websites for websiteId: "+websiteId);

            return $http.get("/api/website/"+websiteId);
        }

        function findWebsitesByUser(userId){

            console.log("Finding websites for userId: "+userId);

            return $http.get("/api/user/"+userId+"/website");
        }
        
        function updateWebsite(websiteId, website) {
            console.log("Updating website " + websiteId);
            return $http.put("/api/website/" + websiteId,website);
        }

        function deleteWebsite(websiteId) {
            console.log("Deleting website-" + websiteId);
            return $http.delete("/api/website/" + websiteId);
        }
    }
})();