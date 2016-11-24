module.exports = function () {
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")();
    var PageModel = mongoose.model("PageModel", PageSchema);

    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage
    };
    
    return api;
    
    function createPage(websiteId, page) {
        page.websiteId = websiteId;
        return PageModel.create(page);
    }
    
    function findAllPagesForWebsite(websiteId) {
        return PageModel.find({websiteId: websiteId});
    }
    
    function findPageById(pageId) {
        return PageModel.findById(pageId);
    }
    
    function updatePage(id, newPage) {
        delete newPage._id;
        
        return PageModel
            .update({_id:id},{
                $set: {
                    name: newPage.name,
                    description: newPage.description
                }
            });
    }
    
    function deletePage(id) {
        return PageModel.remove({_id:id});
    }
    
};