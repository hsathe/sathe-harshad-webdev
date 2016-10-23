(function(){
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService(){
        console.log("Hi!");
        var _websiteId = 800;
        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
            { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
            { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
            { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
        ];

        var api = {
            createWebsite : createWebsite,
            findWebsitesByUser : findWebsitesByUser,
            findWebsiteById : findWebsiteById,
            updateWebsite : updateWebsite,
            deleteWebsite : deleteWebsite
        };

        return api;

        function createWebsite(userId, newWebsite) {
            _websiteId++;
            newWebsite['_id'] = _websiteId.toString();
            newWebsite['developerId'] = userId;
            
            websites.push(newWebsite);
            console.log("Successfully Created website "+newWebsite.name);
            return newWebsite;
        }
        function findWebsiteById(websiteId) {
            for(var i in websites){
                if(websites[i]._id == websiteId){
                    return websites[i];
                }
            }
            return null;
        }

        function findWebsitesByUser(userId){
            var result = [];
            for(var i in websites){
                if(websites[i].developerId === userId){
                    result.push(websites[i]);
                }
            }
            console.log("Found "+result.length + "websites for userId "+userId);
            return result;
        }
        
        function updateWebsite(websiteId, website) {
            console.log("Updating Website-"+websiteId);
            var oldWebsite = findWebsiteById(websiteId);
            if(oldWebsite){
                oldWebsite.name = website.name;
                oldWebsite.description = website.description;
                oldWebsite.developerId = website.developerId;
                console.log("Website Updated-"+oldWebsite);
                return true;
            }
            return false;
        }

        function deleteWebsite(websiteId) {
            console.log("Deleting website-"+websiteId);
            for(var i in websites){
                if(websites[i]._id === websiteId){
                    websites.splice(i,1);
                    console.log("Deleted Website-"+websiteId);
                    return true;
                }
            }
            console.log("Unable to delete Website-"+websiteId);
            return false;
        }

    }
})();