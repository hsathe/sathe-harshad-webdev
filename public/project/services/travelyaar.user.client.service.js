(function () {
    angular
        .module("PlacesApp")
        .factory("TravelYaarUserService", TravelYaarUserService);
    
    function TravelYaarUserService($http) {
        console.log("In TravelYaarUserService");
        var api = {
            signIn: signIn,
            signUp: signUp,
            signout: signout,
            loggedIn: loggedIn,
            createUser: createUser,
            findUserById: findUserById,
            getAllUsers: getAllUsers,
            getUsersToFollow: getUsersToFollow,
            getFollowersForUser: getFollowersForUser,
            getFollowingForUser: getFollowingForUser,
            addToFollowers: addToFollowers,
            addToFollowing: addToFollowing,
            addToRecommendations: addToRecommendations,
            removeFromFollowers: removeFromFollowers,
            removeFromFollowing: removeFromFollowing,
            removeFromRecommendation: removeFromRecommendation,
            getRecommendationsForUser: getRecommendationsForUser,
            updateUser: updateUser,
            getFilteredFeed: getFilteredFeed,
            getUserFeed: getUserFeed
        };
        
        return api;
        
        function signIn(user) {
            console.log("SignIn with user: "+user);
            return $http.post("/api/login", user);
        }
        function signUp(newUser) {
            console.log("Registering New User " + newUser.email);
            return $http.post("/api/register", newUser);
        }
        
        function signout() {
            return $http.post("/api/logout");
        }
        
        function loggedIn(){
            return $http.get("/api/loggedIn");
        }
        function createUser(newUser){
            console.log("createUser - " + newUser.email);
            return $http.post("/api/user", newUser);
        }
        
        function findUserById(userId){
            console.log("findUserById - ", userId);
            return $http.get("/api/user/" + userId);
        }

        function getAllUsers(){
            console.log("getAllUsers -");
            return $http.get("/api/user");
        }

        function getUsersToFollow(userId){
            console.log("getUsersToFollow - ", userId);
            return $http.get("/api/user/"+ userId +"/tofollow");
        }
        
        function getFollowersForUser(userId){
            console.log("getFollowersForUser - ", userId);
            return $http.get("/api/user/"+ userId +"/followers");
        }

        function getFollowingForUser(userId){
            console.log("getFollowingForUser - ", userId);
            return $http.get("/api/user/"+ userId +"/following");
        }

        function updateUser(userId, user){
            console.log("updateUser - " + userId);
            return $http.put("/api/user/" + userId, user);
        }

        function addToFollowers(userId, follower){
            console.log("addToFollowers - " + userId + " " + follower._id);
            return $http.put("/api/user/"+ userId +"/followers", follower);
        }

        function addToFollowing(userId, following){
            console.log("addToFollowing - " + userId + " " + following._id);
            return $http.put("/api/user/"+ userId +"/following", following);
        }

        function removeFromFollowers(userId, followerId){
            console.log("removeFromFollowers - " + userId + " " + followerId);
            return $http.delete("/api/user/"+ userId +"/followers?followerId="+followerId);
        }

        function removeFromFollowing(userId, followingId){
            console.log("removeFromFollowing - " + userId + " " + followingId);
            return $http.delete("/api/user/"+userId+"/following?followingId="+followingId);
        }

        function addToRecommendations(userId, place) {
            console.log("addToRecommendation : "+userId+" "+ place);
            return $http.put("/api/user/"+ userId +"/recommendation", place);
        }

        function removeFromRecommendation(userId, placeId) {
            console.log("removeFromRecommendations : "+userId+" "+ placeId);
            return $http.delete("/api/user/"+ userId +"/recommendation?placeId="+placeId);
        }
        
        function getRecommendationsForUser(userId) {
            console.log("Getting recommendations for the user  "+userId);
            return $http.get("/api/user/"+userId+"/recommendations");
        }
        
        function getFilteredFeed(userId) {
            console.log("Filtered Feed for "+ userId);
            return $http.get("/api/user/"+userId+"/publicfeed");
        }
        
        function getUserFeed(userId) {
            console.log("User feed for "+ userId);
            return $http.get("/api/user/"+userId+"/feed");
        }
    }
})();