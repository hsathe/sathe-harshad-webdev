module.exports = function (app) {
    var models = require("./models/models.server")();
    require("./services/travelyaar.user.service.server")(app,models);
    require("./services/place.service.server")(app, models);
}