module.exports = function () {
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server")();

    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);
    var api = {
        createWebsite: createWebsite,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
        
    };

    return api;

    function createWebsite(userId, website) {
        website._user = userId;
        return WebsiteModel.create(website);
    }
    
    function findAllWebsitesForUser(userId) {
        return WebsiteModel.find({"developerId": userId});
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }
    function updateWebsite(websiteId, newWebsite) {
        delete newWebsite._id;
        return WebsiteModel
            .update({_id:websiteId},{
                $set: {
                    name: newWebsite.name,
                    description: newWebsite.description
                }
            });
    }
    function deleteWebsite(id) {
        console.log("Server side, removing website:"+id);
        return WebsiteModel.remove({_id:id});
    }
};
