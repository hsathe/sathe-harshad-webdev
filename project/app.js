module.exports = function (app) {
    var models = require("./models/models.server")();
    require("./services/travelyaar.user.service.server")(app,models);
}