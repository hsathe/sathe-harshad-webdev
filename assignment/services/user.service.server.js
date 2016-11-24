module.exports = function (app, model) {
    // var users = [
    //     {_id: "123", username: "alice",    password: "alice", email : "alice@wonderland",   firstName: "Alice",  lastName: "Wonder"  },
    //     {_id: "234", username: "bob",      password: "bob", email : "bob@bob",      firstName: "Bob",    lastName: "Marley"  },
    //     {_id: "345", username: "charly",   password: "charly", email : "charly@charly",   firstName: "Charly", lastName: "Garcia"  },
    //     {_id: "456", username: "jannunzi", password: "jannunzi", email : "jannunzi@jannunzi", firstName: "Jose",   lastName: "Annunzi" }
    // ];
    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);
    

    function createUser(req, res) {
        var user = req.body;
        // user._id = (new Date()).getTime().toString();
        // users.push(user);
        model
            .userModel
            .createUser(user)
            .then(
                function (newUser) {
                    console.log("This is success");
                    res.send(newUser);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        
        if(username && password){
            // Find user by given username & password.
            findUserByCredentials(username,password, res);
        } else if(username){
            // Find user with provided username
            findUserByUsername(username, res);
        }else{
            res.send(users);
        }
    }

    function findUserByUsername(username, res) {
        // for(var u in users){
        //     if(users[u].username === username){
        //         res.send(users[u]);
        //         return;
        //     }
        // }
        // res.send('0');
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    res.send(user);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUserByCredentials(username,password, res) {
        // for(var u in users){
        //     if(users[u].username === username && users[u].password === password){
        //         res.send(users[u]);
        //         return;
        //     }
        // }
        // // Send 0 response if no user is found.
        // res.send('0');
        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    res.send(user);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model
            .userModel
            .findUserById(userId)
            .then(
                function (user) {
                    if(user){
                        res.send(user);
                    } else{
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        model
            .userModel
            .updateUser(userId, newUser)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
        // for(var u in users){
        //     if(users[u]._id === userId){
        //         users[u].firstName = newUser.firstName;
        //         users[u].email = newUser.email;
        //         users[u].lastName = newUser.lastName;
        //         res.sendStatus(200);
        //         return;
        //     }
        // }
        // res.sendStatus(400);

    }
    
    function deleteUser(req, res) {

        var userId = req.params.userId;
        console.log("Deleting user" + userId);
        model
            .userModel
            .deleteUser(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }
}