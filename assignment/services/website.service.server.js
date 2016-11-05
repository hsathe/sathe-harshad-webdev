module.exports = function (app) {

    var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
        { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
        { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
        { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
        { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
    ];
    
    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);
    
    function createWebsite(req, res) {
        var uid = req.params.userId;
        var website = req.body;
        
        for(var w in websites){
            // If the website name for the developer already exists.
            if(websites[w].developerId === uid && websites[w].name === website.name){
                res.sendStatus(400);
                return;
            }
        }
        // Generate new ID and insert the new website in websites
        website._id = (new Date()).getTime().toString();
        websites.push(website);
        res.send(websites);
    }
    
    
    function findAllWebsitesForUser(req, res) {
        var uid = req.params.userId;
        console.log(uid);
        var result = [];
        for(var w in websites){
            if(websites[w].developerId === uid){
                result.push(websites[w]);
            }
        }
        res.json(result);
    }
    
    function findWebsiteById(req, res) {
        var wID = req.params.websiteId;
        
        for(var w in websites){
            if(websites[w]._id === wID){
                res.send(websites[w]);
                return;
            }
        }
        
        res.send('0');
    }
    
    function updateWebsite(req, res) {
        var wID = req.params.websiteId;
        var newWebsite = req.body;
        
        for(var w in websites){
            if(websites[w]._id === wID){
                websites[w].name = newWebsite.name;
                websites[w].developerId = newWebsite.developerId;
                websites[w].description = newWebsite.description;
                // Successfully updated the website
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(400);
    }
    
    function deleteWebsite(req, res) {
        var wID = req.params.websiteId;

        for (var w in websites) {
            if (websites[w]._id === wID) {
                websites.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(400);
    }
};