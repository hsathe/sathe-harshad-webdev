module.exports = function (app) {
    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
        { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
    ];

    app.post('/api/user/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    function createPage(req, res) {
        var wid = req.params.websiteId;
        var page = req.body;

        for(var p in pages){
            if(pages[p].websiteId === wid && pages[p].name === page.name){
                res.sendStatus(400);
                return;
            }
        }
        page._id = (new Date()).getTime().toString();
        pages.push(page);
        res.send(page);
    }
    
    function findAllPagesForWebsite(req, res) {
        var wid = req.params.websiteId;
        var result = [];
        
        for(var p in pages){
            if(pages[p].websiteId === wid){
                result.push(pages[p]);
            }
        }
        
        res.json(result);
    }
    
    function findPageById(req, res) {
        var pageId = req.params.pageId;
        
        for(var p in pages){
            if(pages[p]._id === pageId){
                res.send(pages[p]);
                return;
            }
        }
        res.send('0');
    }
    
    function updatePage(req, res) {
        var pId = req.params.pageId;
        console.log(pId);
        var newPage = req.body;
        
        for(var p in pages){
            if(pages[p]._id === pId){
                console.log("Matching Page")
                pages[p].name = newPage.name;
                pages[p].description = newPage.description;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(400);
    }

    function deletePage(req, res) {
        var pId = req.params.pageId;

        for(var p in pages){
            if(pages[p]._id === pId){
                pages.splice(p,1);
                res.sendStatus(200);
                return;
            }
        }
        // Send error response, since the page doesn't exist.
        res.sendStatus(400);
    }
    
    
};