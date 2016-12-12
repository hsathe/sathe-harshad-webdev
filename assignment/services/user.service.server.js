module.exports = function (app, model) {

    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var LocalStrategy = require('passport-local').Strategy;
    // var FacebookStrategy = require('passport-facebook').Strategy;

    app.use(session({
        secret: 'This is a secret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(assignmentStrategy));

    // app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    // app.get('/auth/facebook/callback',
    //     passport.authenticate('facebook', {
    //         successRedirect: '/assignment/#/user',
    //         failureRedirect: '/assignment/#/login'
    //     }));

    // var assignment_fbConfig = {
    //     clientID: process.env.FACEBOOK_CLIENT_ID,
    //     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    //     callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    //     profileFields: ['id', 'name', 'email']
    // };
    // passport.use(new FacebookStrategy(assignment_fbConfig, assignment_fbLogin));

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.post("/api/login", passport.authenticate('local'), login);
    app.post("/api/logout", logout);
    app.get("/api/loggedIn", loggedIn);
    app.post("/api/register", register);

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model
            .userModel
            .findUserById(user._id)
            .then(function (user) {
                    done(null, user);
                },
                function (error) {
                    done(error, null);
                });
    }

    function assignment_fbLogin(token, refreshToken, profile, done) {
        // console.log(profile);
        model.userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (facebookUser) {
                    if (facebookUser) {
                        return done(null, facebookUser);
                    } else {
                        facebookUser = {
                            // username: profile.displayName.replace(/ /g, ''),
                            // firstName: profile.displayName.split(' ').slice(0, -1).join(' '),
                            // lastName: profile.displayName.split(' ').slice(-1).join(' '),
                            username: profile.name.givenName.concat(profile.name.familyName).toLowerCase(),
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            facebook: {
                                token: token,
                                id: profile.id
                            }
                        };
                        model.userModel
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

    function register(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user) {
                        res.status(400).send("Username already exists!");
                    } else {
                        password = bcrypt.hashSync(req.body.password);
                        return model.userModel
                            .createUser({username: username, password: password});
                    }
                }, function (err) {
                    res.status(400).send(err);
                }
            ).then(
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

    function createUser(req, res) {
        var user = req.body;
        model
            .userModel
            .findUserByUsername(user.username)
            .then(function (stats) {
                if (stats.length !== 0) {
                    res.status(400).send("Username Already Exists");
                } else {
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
                            });
                }
            });
    }

    function assignmentStrategy(username, password, done) {
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user && user.username === username && bcrypt.compareSync(password, user.password)) {
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

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedIn(req, res) {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send(false);
        }
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        if (username && password) {
            // Find user by given username & password.
            findUserByCredentials(username, password, res);
        } else if (username) {
            // Find user with provided username
            findUserByUsername(username, res);
        } else {
            res.send(users);
        }
    }

    function findUserByUsername(username, res) {
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

    function findUserByCredentials(username, password, res) {
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
                    if (user) {
                        res.send(user);
                    } else {
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
            );
    }
};