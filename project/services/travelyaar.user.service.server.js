module.exports = function (app, models) {
    var passport = require('passport');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');


    app.use(cookieParser());
    // app.use(session({secret: process.env.SESSION_SECRET}));
    app.use(session({secret: 'This is a secret'}));
    app.use(passport.initialize());
    app.use(passport.session());

    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(projectStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var TravelYaarUserModel = models.travelyaarUserModel;
    
    app.post("/api/register", signUp);
    app.post("/api/login", passport.authenticate('local'), signIn);
    app.post("/api/logout", signout);
    app.get("/api/user", getAllUsers);
    app.get("/api/user/:userId/tofollow", getUsersToFollow);
    app.get("/api/user/:userId", getUserById);
    app.put("/api/user/:userId", updateUser);
    app.put("/api/user/:userId/followers", addToFollowers);
    app.put("/api/user/:userId/following", addToFollowing);
    app.delete("/api/user/:userId/followers", removeFromFollowers);
    app.delete("/api/user/:userId/following", removeFromFollowing);
    app.get("/api/user/:userId/followers", getFollowersForUser);
    app.get("/api/user/:userId/following", getFollowingForUser);
    
    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        TravelYaarUserModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function projectStrategy(username, password, done) {
        TravelYaarUserModel
            .findUserByEmail(username)
            .then(
                function(user) {
                    if(user && user.email === username && password, user.password) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }
    function signIn(req, res) {
        var user = req.user;
        res.json(user);
    }
    function signUp(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        
        TravelYaarUserModel
            .findUserByEmail(email)
            .then(
                function(user){
                    if(user){
                        res.status(400).send("User already exists");
                    }else{
                        password = req.body.password;
                        return TravelYaarUserModel
                            .createUser({
                                email: email,
                                firstName:firstName,
                                lastName:lastName,
                                password: password
                            });
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (user) {
                    if(user){
                        req.login(user, function (err) {
                            if(err){
                                res.status(400).send(err);
                            } else{
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }
    
    function getAllUsers(req, res) {
        TravelYaarUserModel.findAllUsers()
            .then(
                function (response) {
                    res.json(response);
                },
                function (err) {
                    res.status(400).send("Unable to find any users");
                }
            );
    }
    
    function getUsersToFollow(req, res) {
        var userId = req.params.userId;
        TravelYaarUserModel.findUserById(userId)
            .then(
                function (user) {
                    user.following.push(user._id);
                    TravelYaarUserModel
                        .findUsersToFollow(user)
                        .then(
                            function (toFollow) {
                                res.json(toFollow);
                            },
                            function (err) {
                                res.status(400).send("Could not find users to follow");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Could not find user");
                }
            );
    }

    function getFollowersForUser(req, res) {
        var userId = req.params.userId;
        TravelYaarUserModel.findUserById(userId)
            .then(
                function (user) {
                    TravelYaarUserModel
                        .findFollowersForUser(user)
                        .then(
                            function (followers) {
                                res.json(followers);
                            },
                            function (err) {
                                res.status(404).send("Could not find followers for users");
                            }
                        );
                }, function (err) {
                    res.status(400).send("Could not find user");
                }
            );
    }

    function getFollowingForUser(req, res) {
        var userId = req.params.userId;
        TravelYaarUserModel.findUserById(userId)
            .then(
                function (user) {
                    TravelYaarUserModel
                        .findFollowingForUser(user)
                        .then(
                            function (following) {
                                res.json(following);
                            },
                            function (err) {
                                res.status(404).send("Could not find followers for users");
                            }
                        );
                }, function (err) {
                    res.status(400).send("Could not find user");
                }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        TravelYaarUserModel.updateUser(userId,newUser)
            .then(function (success) {
                res.status(200).send("User updated!");
            },function (err) {
                res.status(400).send("Problem in updating user");
            });
    }

    // ToDo:
    function deleteUser(req, res) {
        var userId = req.params.userId;
    }
    
    function getUserById(req, res) {
        var userId = req.params.userId;
        TravelYaarUserModel.findUserById(userId)
            .then(
                function (user) {
                    res.json(user);
                }, function (err) {
                    res.status(400).send("Could not find user");
                }
            );
    }

    function addToFollowers(req, res) {
        var userId = req.params.userId;
        var followerId = req.body._id;
        TravelYaarUserModel
            .addFollower(followerId, userId)
            .then(
                function (success) {
                    TravelYaarUserModel.addFollowing(userId,followerId)
                        .then(
                            function (success) {
                                res.status(200).send("Follower added successfully");
                            },function (err) {
                                res.status(400).send("Could not add follower");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Could not add follower");
                }
            );
    }

    function removeFromFollowers(req, res) {
        var userId = req.params.userId;
        var followerId = req.query.followerId;
        TravelYaarUserModel
            .removeFollower(followerId, userId)
            .then(
                function (success) {
                    TravelYaarUserModel.removeFollowing(userId,followerId)
                        .then(
                            function (success) {
                                res.status(200).send("Follower removed successfully");
                            },function (err) {
                                res.status(400).send("Could not remove follower");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Could not remove follower");
                }
            );
    }

    function addToFollowing(req, res) {
        var userId = req.params.userId;
        var followerId = req.body._id;
        TravelYaarUserModel
            .addFollowing(followerId, userId)
            .then(
                function (success) {
                    TravelYaarUserModel.addFollower(userId,followerId)
                        .then(
                            function (success) {
                                res.status(200).send("Following added successfully");
                            },function (err) {
                                res.status(400).send("Could not add Following");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Could not add following");
                }
            );
    }
    
    function removeFromFollowing(req, res) {
        var userId = req.params.userId;
        var followerId = req.query.followingId;
        TravelYaarUserModel
            .removeFollowing(followerId, userId)
            .then(
                function (success) {
                    TravelYaarUserModel.removeFollower(userId,followerId)
                        .then(
                            function (success) {
                                res.status(200).send("Following removed successfully");
                            },function (err) {
                                res.status(400).send("Could not remove Following");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Could not remove following");
                }
            );
    }
    function signout(req, res) {
        req.logout();
        res.sendStatus(200);
    }
    
}