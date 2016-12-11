var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: 'This is a secret'
}));
// app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

//  Option 4:
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// Option 3:
// app.use('/public',function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     // Request headers you wish to allow
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     // Set to true if you need the website to include cookies in the requests sent
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     // Pass to next layer of middleware
//     next();
// });

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));


// Try out!!!
//Option 1:
// var cors = require('cors');
//
// // use it before all route definitions
// app.use(cors({origin: 'http://localhost:3000'}));

/*
Option 2:
To Resolve Allow Controll Access Header issue
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

*/
// require ("./test/app.js")(app);
// require("./assignment/app.js")(app);
require("./project/app.js")(app);
app.set('ipaddress', (process.env.IP || '127.0.0.1'));
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), app.get('ipaddress'));
