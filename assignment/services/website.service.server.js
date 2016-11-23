module.exports = function (app, model) {

    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);
    
    function createWebsite(req, res) {
        var uid = req.params.userId;
        var website = req.body;

        model
            .websiteModel
            .createWebsite(uid, website)
            .then(
                function (website) {
                    res.json(website);
                    return website;
                },
                function (error) {
                    console.log(error);
                }
            ).then(
            function (website) {
                pushWebsitesForUser(uid, website._id);
            }, function (error) {
                console.log("Error creating website");
            });
    }
    
    function pushWebsitesForUser(uid, websiteId) {
        model
            .userModel
            .findUserById(uid)
            .then(
                function (user) {
                    user.websites.push(websiteId);
                    user.save();
                }, function (error) {
                    console.log("Error pushing websites for usr");
                }
            );
    }
    
    function findAllWebsitesForUser(req, res) {
        var uid = req.params.userId;
        console.log(uid);
        model
            .websiteModel
            .findAllWebsitesForUser(uid)
            .then(
                function (websites) {
                    res.send(websites);
                }, function (error) {
                    res.sendStatus(400).error(error);
                }
            )
    }
    
    function findWebsiteById(req, res) {
        var wID = req.params.websiteId;
        
        model
            .websiteModel
            .findWebsiteById(wID)
            .then(
                function (website) {
                    res.send(website);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function updateWebsite(req, res) {
        var wID = req.params.websiteId;
        var newWebsite = req.body;

        model
            .websiteModel
            .updateWebsite(wID, newWebsite)
            .then(
                function () {
                    res.sendStatus(200);
                }, function (error) {
                    res.sendStatus(400);
                }
            )
    }
    
    function deleteWebsite(req, res) {
        var id = req.params.websiteId;
        model.websiteModel
            .findWebsiteById(id)
            .then(function (website){
                deleteWebsiteFromUser(website.developerId, id);
                return id;
            }, function (error){
                console.log("Error removing website from user.");
            }).then(function (id){
            model.websiteModel
                .deleteWebsite(id)
                .then(function (stats){
                    res.sendStatus(200);
                    return id;
                }, function(error){
                    res.sendStatus(404);
                });
        });
    }

    function deleteWebsiteFromUser(developerId, websiteId) {
        console.log("Service Layer, deleting website from user");
        model
            .userModel
            .findUserById(developerId)
            .then(function (user) {
                var index = user.websites.indexOf(websiteId);
                if(index > -1){
                    user.websites.splice(index, 1);
                    user.save();
                }else{
                    console.log("Index not found");
                }
            }, function (error) {
                console.log("Error removing website from user");
                }
            )
    }
};