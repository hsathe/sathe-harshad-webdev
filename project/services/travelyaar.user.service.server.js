module.exports = function (app, models) {
    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    var TravelYaarUserModel = models.travelyaarUserModel;

    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    // var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(session({
        secret: 'This is a secret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(projectStrategy));


    // var project_gConfig = {
    //     clientID     : process.env.G_P_CLIENT_ID, 145129827061-fcgbcaq8o120jr8hceemcfchgvd4aaec.apps.googleusercontent.com
    //     clientSecret : process.env.G_P_CLIENT_SECRET, O45lg-Q0uYuoM7ZdGDxDs-22
    //     callbackURL  : process.env.G_P_CALLBACK_URL http://localhost:3000/auth/project/google/callback
    // };

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/project/#/profile',
            failureRedirect: '/project/#/signin'
        }));

    var project_fbConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        enableProof: true,
        profileFields: ['id', 'name', 'email']
    };

    passport.use(new FacebookStrategy(project_fbConfig, project_fbLogin));


    // app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    // app.get('/auth/google/callback',
    //     passport.authenticate('google', {
    //         successRedirect: '/project/#/profile',
    //         failureRedirect: '/project/#/signin'
    //     }));
    //
    // var project_gConfig = {
    //     clientID     : process.env.G_P_CLIENT_ID,
    //     clientSecret : process.env.G_P_CLIENT_SECRET,
    //     callbackURL  : process.env.G_P_CALLBACK_URL
    // };
    //
    // passport.use(new GoogleStrategy(project_gConfig, project_gLogin));


    app.post("/api/user", createUser);
    app.get("/api/user", getAllUsers);
    app.get("/api/user/:userId/tofollow", getUsersToFollow);
    app.get("/api/user/:userId", getUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.put("/api/user/:userId/followers", addToFollowers);
    app.put("/api/user/:userId/following", addToFollowing);
    app.delete("/api/user/:userId/followers", removeFromFollowers);
    app.delete("/api/user/:userId/following", removeFromFollowing);
    app.get("/api/user/:userId/followers", getFollowersForUser);
    app.get("/api/user/:userId/following", getFollowingForUser);
    app.put("/api/user/:userId/recommendation", addToRecommendation);
    app.delete("/api/user/:userId/recommendation", removeFromRecommendation);
    app.get("/api/user/:userId/recommendations", getRecommendationsForUser);
    app.get("/api/user/:userId/feed", getUserFeed);
    app.get("/api/user/:userId/publicfeed", getFilteredFeed);
    app.get("/api/loggedIn", loggedIn);
    app.post("/api/register", signUp);
    app.post("/api/login", passport.authenticate('local'), signIn);
    app.post("/api/logout", signout);


    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        TravelYaarUserModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function projectStrategy(username, password, done) {
        TravelYaarUserModel
            .findUserByEmail(username)
            .then(
                function (user) {
                    if (user && user.email === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function project_fbLogin(token, refreshToken, profile, done) {
        console.log(profile);
        TravelYaarUserModel
            .findUserByEmail(profile.emails[0].value)
            .then(
                function (facebookUser) {
                    if (facebookUser) {
                        return done(null, facebookUser);
                    } else {
                        facebookUser = {
                            email: profile.emails[0].value,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            facebook: {
                                token: token,
                                id: profile.id
                            }
                        };
                        TravelYaarUserModel
                            .createUser(facebookUser)
                            .then(
                                function (user) {
                                    done(null, user);
                                }
                            );
                    }
                }
            );
    }

    /*function project_gLogin(token, refreshToken, profile, done){
     TravelYaarUserModel
     .findUserByEmail(profile.emails[0].value)
     .then(
     function(googleUser) {
     if(googleUser) {
     return done(null, googleUser);
     } else {
     googleUser = {
     email: profile.emails[0].value,
     firstName: profile.name.givenName,
     lastName: profile.name.familyName,
     google: {
     token: token,
     id: profile.id
     }
     };
     TravelYaarUserModel
     .createUser(googleUser)
     .then(
     function(user) {
     done(null, user);
     }
     );
     }
     }
     );
     }*/


    function loggedIn(req, res) {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send(false);
        }
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
                function (user) {
                    if (user) {
                        res.status(400).send("User already exists");
                    } else {
                        password = bcrypt.hashSync(req.body.password);
                        return TravelYaarUserModel
                            .createUser({
                                email: email,
                                firstName: firstName,
                                lastName: lastName,
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
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    function signout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function createUser(req, res) {
        var user = req.body;
        TravelYaarUserModel
            .findUserByEmail(user.email)
            .then(function (status) {
                if (status.length != 0) {
                    res.status(400).send("User already exists");
                }
                else {
                    TravelYaarUserModel
                        .createUser(user)
                        .then(
                            function (user) {
                                res.json(user);
                            },
                            function (err) {
                                res.status(400).send("Something went wrong, Failed to created user");
                            }
                        );
                }
            });
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
        TravelYaarUserModel.updateUser(userId, newUser)
            .then(function (success) {
                res.status(200).send("User updated!");
            }, function (err) {
                res.status(400).send("Problem in updating user");
            });
    }

    // ToDo:
    function deleteUser(req, res) {
        var userId = req.params.userId;
        TravelYaarUserModel
            .findUserById(userId)
            .then(
                function (user) {
                    models.placeModel
                        .removeAllRecommendationsByUser(user)
                        .then(
                            function (success) {
                                TravelYaarUserModel.removeUserFromFollowing(user)
                                    .then(
                                        function (success) {
                                            TravelYaarUserModel.removeUserFromAllFollowers(user)
                                                .then(
                                                    function (success) {
                                                        TravelYaarUserModel
                                                            .deleteUser(userId)
                                                            .then(
                                                                function (success) {
                                                                    res.status(200).send("Deleted User");
                                                                },
                                                                function (err) {
                                                                    res.status(400).send("Could not delete user");
                                                                }
                                                            );
                                                    },
                                                    function (err) {
                                                        res.status(400).send("Could not remove user from Followers");
                                                    }
                                                );
                                        },
                                        function () {
                                            res.status(400).send("Could not remove user from following");
                                        }
                                    );
                            },
                            function (err) {
                                res.status(404).send("Could not find user");
                            }
                        );
                },
                function (err) {
                    res.status(404).send("Could not erase reco from user");
                }
            );
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
                    TravelYaarUserModel.addFollowing(userId, followerId)
                        .then(
                            function (success) {
                                res.status(200).send("Follower added successfully");
                            }, function (err) {
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
                    TravelYaarUserModel.removeFollowing(userId, followerId)
                        .then(
                            function (success) {
                                res.status(200).send("Follower removed successfully");
                            }, function (err) {
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
                    TravelYaarUserModel.addFollower(userId, followerId)
                        .then(
                            function (success) {
                                res.status(200).send("Following added successfully");
                            }, function (err) {
                                res.status(400).send("Could not add Following");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Could not add following");
                }
            );
    }

    function addToRecommendation(req, res) {
        var userId = req.params.userId;
        // var placeId = req.query.placeId;
        var placeId = req.body.place_id;
        TravelYaarUserModel
            .addRecommendation(placeId, userId)
            .then(
                function (success) {
                    models.placeModel
                        .addRecommendationByUser(placeId, userId)
                        .then(
                            function (success) {
                                res.status(200).send("User recommendation added");
                            },
                            function (err) {
                                res.status(400).send("Could not add recommendation");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Not added to recommendation");
                }
            );
    }

    function removeFromRecommendation(req, res) {
        var userId = req.params.userId;
        var placeId = req.query.placeId;

        TravelYaarUserModel
            .findUserById(userId)
            .then(
                function (user) {
                    models.placeModel
                        .findPlaceById(placeId)
                        .then(
                            function (place) {
                                TravelYaarUserModel.removeRecommendation(place.placeId, user._id)
                                    .then(
                                        function (success) {
                                            models.placeModel.removeRecommendationByUser(place.placeId, user._id)
                                                .then(
                                                    function (success) {
                                                        res.status(200).send("User recommendation removed");
                                                    },
                                                    function (err) {
                                                        res.status(400).send("Unable to remove user recommendation");
                                                    }
                                                );
                                        },
                                        function (err) {
                                            res.status(400).send("Unable to remove from recommendations");
                                        }
                                    );
                            },
                            function (err) {
                                res.status(400).send("Place not available");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Unable to find user");
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
                    TravelYaarUserModel.removeFollower(userId, followerId)
                        .then(
                            function (success) {
                                res.status(200).send("Following removed successfully");
                            }, function (err) {
                                res.status(400).send("Could not remove Following");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Could not remove following");
                }
            );
    }

    function getRecommendationsForUser(req, res) {
        var userId = req.params.userId;

        TravelYaarUserModel
            .findUserById(userId)
            .then(
                function (user) {
                    models.placeModel
                        .getRecommendationsForUser(user)
                        .then(
                            function (recommendations) {
                                res.json(recommendations);
                            },
                            function (err) {
                                res.status(400).send("Could not find recommendations for user");
                            }
                        );
                },
                function (err) {
                    res.status(400).send("Could not find user");
                }
            );
    }

    function getUserFeed(req, res) {
        var userId = req.params.userId;
        TravelYaarUserModel
            .findUserById(userId)
            .then(
                function (user) {
                    models.placeModel
                        .getUserFeed(user)
                        .then(
                            function (feed) {
                                res.json(feed);
                            },
                            function (err) {
                                res.status(400).send("No data found for this user");
                            }
                        );
                },
                function (err) {
                    res.status(404).send("User not found");
                }
            );
    }

    function getFilteredFeed(req, res) {
        var userId = req.params.userId;
        TravelYaarUserModel
            .findUserById(userId)
            .then(
                function (user) {
                    models.placeModel
                        .getFilteredFeed(user)
                        .then(
                            function (feed) {
                                res.json(feed);
                            },
                            function (err) {
                                res.status(400).send("No data found for this user");
                            }
                        );
                },
                function (err) {
                    res.status(404).send("User not found");
                }
            );
    }

}