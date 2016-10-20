(function(){
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService(){
        console.log("Hi!");
        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
            { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
            { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
            { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
        ];

        var api = {
            findWebsitesByUser : findWebsitesByUser
        };

        return api;

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
    }
})();