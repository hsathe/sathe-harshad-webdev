module.exports = function () {
    var mongoose = require('mongoose');

    // var connectionString = 'mongodb://127.0.0.1:27017/project-fall-2016';
    // console.log(connectionString);
    var connectionString = 'mongodb://127.0.0.1:27017/wam-fall-2016';

    mongoose.connect(process.env.MONGODB_URI || connectionString);

    return{
        travelyaarUserModel: require("./user/travelyaar.user.model.server")(),
        placeModel: require("./places/place.model.server")()
    };

};