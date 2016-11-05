(function(){
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http){
        var api = {
            createUser : createUser,
            findUserByUsername: findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            findUserById : findUserById,
            updateUser : updateUser,
            deleteUser : deleteUser
        };

        return api;

        function createUser(newUser) {
            console.log("Creating User "+newUser.username);
            return $http.post("/api/user",newUser);
        }
        function findUserByCredentials(username, password){
            console.log("Find User by Credentials "+ username+"-"+password);

            var url = '/api/user?username='+username+'&password='+password;
            return $http.get(url);
        }

        function findUserById(userId){
            console.log("Find User by Id "+userId);

            var url = '/api/user/'+userId;
            return $http.get(url);
        }
        
        function findUserByUsername(username) {
            console.log("Find user by Username "+username);

            var url = '/api/user?username='+username;
            return $http.get(url);
        }
        
        function updateUser(userId, user) {
            console.log("Updating User, userId :"+userId);

            var url = "/api/user/"+userId;
            console.log(url);
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            console.log("Deleting user");
            var requestUrl = "/api/user/" + userId;
            return $http.delete(requestUrl);
        }
    }
})();