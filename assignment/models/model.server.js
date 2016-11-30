module.exports = function () {
    var mongoose = require('mongoose');
    // mongoose.connect('mongodb://localhost/wam-fall-2016');
    var connectionString = 'mongodb://127.0.0.1:27017/wam-fall-2016';

    if(process.env.WEB_CONCURRENCY){
        connectionString = process.env.MONGODB_URI;
    }

    mongoose.connect(connectionString);

    var userModel = require("./user/user.model.server")();
    var websiteModel = require("./website/website.model.server")();
    var pageModel = require("./page/page.model.server")();
    var widgetModel = require("./widget/widget.model.server")();
    var model = {
        userModel: userModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel
    };
    return model;
};