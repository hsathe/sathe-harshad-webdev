module.exports = function (app, model) {
    // var pages = [
    //     { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
    //     { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
    //     { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
    // ];

    app.post('/api/user/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    function createPage(req, res) {
        var wid = req.params.websiteId;
        var page = req.body;

        // for(var p in pages){
        //     if(pages[p].websiteId === wid && pages[p].name === page.name){
        //         res.sendStatus(400);
        //         return;
        //     }
        // }
        // page._id = (new Date()).getTime().toString();
        // pages.push(page);
        // res.send(page);
        model
            .pageModel
            .createPage(wid, page)
            .then(function (page) {
                res.send(page);
                return page;
            }, function (error) {
                res.sendStatus(400).send(error);
            }).then(function (page) {
            pushPagesForWebsite(wid, page._id);
        }, function (error) {
            console.log("Error creating page");
        });
    }
    
    function pushPagesForWebsite(websiteId, pageId) {
        model.websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                website.pages.push(pageId);
                website.save();
            }, function (error) {
                console.log("Error");
            });
    }
    function findAllPagesForWebsite(req, res) {
        var wid = req.params.websiteId;
        model
            .pageModel
            .findAllPagesForWebsite(wid)
            .then(function (pages) {
                res.send(pages);
            },function (error) {
                res.sendStatus(400).send(error);
            })
    }
    
    function findPageById(req, res) {
        var pageId = req.params.pageId;
        model
            .pageModel
            .findPageById(pageId)
            .then(function (page) {
                res.send(page);
            }, function (error) {
                res.sendStatus(400);
            });
    }
    
    function updatePage(req, res) {
        var pId = req.params.pageId;
        console.log(pId);
        var newPage = req.body;
        
        model
            .pageModel
            .updatePage(pId, newPage)
            .then(function (status) {
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(400);
            })
    }

    function deletePage(req, res) {
        var pId = req.params.pageId;

        model
            .pageModel
            .findPageById(pId)
            .then(function (page) {
                deletePageFromWebsites(page.websiteId, pId);
                return pId;
            }, function (error) {
                console.log("Error");
            }).then(function (id) {
            model
                .pageModel
                .deletePage(id)
                .then(function (status) {
                    res.sendStatus(200);
                    return id;
                },function (error) {
                    res.sendStatus(400);
                });
        });
    }

    function deletePageFromWebsites(websiteId, pageId) {
        model
            .websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                var index = website.pages.indexOf(pageId);
                if(index > -1){
                    website.pages.splice(index, 1);
                    website.save();
                }else{
                    console.log("Error");
                }
            });
    }
};