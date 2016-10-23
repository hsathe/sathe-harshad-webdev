(function(){
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService(){
        var newUserId = 250;
        var users = [
            {_id: "123", username: "alice",    password: "alice", email : "alice@wonderland",   firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob", email : "bob@bob",      firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly", email : "charly@charly",   firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", email : "jannunzi@jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        ];

        var api = {
            createUser : createUser,
            findUserByCredentials : findUserByCredentials,
            findUserById : findUserById,
            updateUser : updateUser,
            deleteUser : deleteUser
        };

        return api;

        function createUser(newUser) {
            var id = -1;
            if(!newUser.username || !newUser.password || !newUser.verifyPassword){
                return id;
            }

            if (newUser.password === newUser.verifyPassword) {
            
                newUserId++;
                var user = {
                    _id: newUserId.toString(),
                    username: newUser.username,
                    password: newUser.password,
                };

                id = newUserId;
                users.push(user);
                console.log(users)
            }
            return id;
        }
        function findUserByCredentials(username, password){
            for(var u in users){
                var user = users[u];
                if(user.username === username && user.password === password){
                    return user;
                }
            }

        }

        function findUserById(userId){
            for(var u in users){
                var user = users[u];
                if(user._id === userId){
                    return user;
                }
            }
            return null;
        }
        
        function updateUser(userId, user) {
            for(var i in users){
                if(users[i]._id === userId){
                    users[i].firstName = user.firstName;
                    users[i].lastName = user.lastName;
                    users[i].email = user.email;
                    console.log("User updated"+ users[i]);
                    return true;
                }
            }

            console.log("User not found");
            return false;
        }

        function deleteUser(userId){
            for(var i in users){
                if(users[i]._id === userId){
                    console.log("Deleted the user : "+ users[i]);
                    users.splice(i,1); //Removes ith item, 1 indicates number of elements
                    return true;
                }
            }
            console.log("User not found");
            return false;
        }

    }


})();