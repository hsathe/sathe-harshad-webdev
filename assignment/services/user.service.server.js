module.exports = function (app, model) {
    
    var passport = require('passport');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    
    app.use(cookieParser());
    // app.use(session({secret: process.env.SESSION_SECRET}));
    app.use(session({secret: 'This is a secret'}));
    app.use(passport.initialize());
    app.use(passport.session());


    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));

    var FaceBookStrategy = require('passport-facebook').Strategy;

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);


    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    app.post("/api/login", passport.authenticate('local'), login);
    app.post("/api/logout", logout);
    app.get("/api/loggedIn", loggedIn);
    app.post("/api/register", register);

    var facebookConfig = {
        // clientID: process.env.FACEBOOK_CLIENT_ID,
        // clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        // callbackURL: process.env.FACEBOOK_CALLBACK_URL
        clientID : '1783238465268855',
        clientSecret: '8cc06999961a2141408c8c9e5f680e1b',
        callbackURL: '/auth/facebook/callback'
    };


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

    passport.use(new FaceBookStrategy(facebookConfig, facebookStrategy));


    function facebookStrategy(token, refreshToken, profile, done) {
        console.log(profile);
        model.userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (facebookUser) {
                    if (facebookUser) {
                        return done(null, facebookUser);
                    } else {
                        facebookUser = {
                            username: profile.displayName.replace(/ /g, ''),
                            firstName: profile.displayName.split(' ').slice(0, -1).join(' '),
                            lastName: profile.displayName.split(' ').slice(-1).join(' '),
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
                    if(user){
                        res.status(400).send("Username already exists!");
                    }else{
                        password = req.body.password;
                        return model.userModel
                            .createUser({username: username, password: password});
                    }
                },function (err) {
                    res.status(400).send(err);
                }
            ).then(
            function (user) {
                if(user){
                    req.login(user, function (err) {
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.json(user);
                        }
                    });
                }
            }
        );
    }

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
    
    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if(user && user.username === username && user.password === password){
                        return done(null, user);
                    }else{
                        return done(null, false);
                    }
                },
                function (err) {
                    if(err){
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
        res.send(200);
    }
    
    function loggedIn(req, res) {
        if(req.isAuthenticated()){
            res.json(req.user);
        }else{
            res.send(false);
        }
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