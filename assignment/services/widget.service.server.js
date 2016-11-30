module.exports = function (app, model) {

    var multer = require('multer');
    var upload = multer({dest: __dirname+'/../../public/uploads'});

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.put("/api/page/:pageId/widget", sortablewidgets);


    function createWidget(req, res) {
        var pId = req.params.pageId;
        var widget = req.body;
        console.log("Creating Image Widget"+widget._id);
        model
            .widgetModel
            .findHighestOrder(pId)
            .then(function (doc) {
                var orderWidgets = -1;
                if(doc && doc.order){
                    orderWidgets = doc.order + 1;
                }else{
                    orderWidgets = 1;
                }
                widget.order = orderWidgets;
                return orderWidgets;
            }, function (error) {
                res.sendStatus(400);
            }).then(function (status) {
            model
                .widgetModel
                .createWidget(pId, widget)
                .then(function (widget) {
                    res.send(widget);
                    return widget;
                }, function (error) {
                    res.statusCode(400).send(error);
                }).then(function (widget) {
                addWidgetsToPage(pId, widget._id);
            },function (error) {
                console.log("Unable to create widget");
            });
        });
    }
    
    function addWidgetsToPage(pageId, widgetId) {
        model
            .pageModel
            .findPageById(pageId)
            .then(function (page) {
                page.widgets.push(widgetId);
                page.save();
            }, function (error) {
                console.log("Error publishing page to widgets")
            })
    }
    function findAllWidgetsForPage(req, res) {
        var pId = req.params.pageId;
        
        model
            .widgetModel
            .findAllWidgetsForPage(pId)
            .then(function (widgets) {
                res.send(widgets);
            },function (error) {
                console.log("Error");
            });
    }

    function findWidgetById(req, res) {
        var wId = req.params.widgetId;
        model
            .widgetModel
            .findWidgetById(wId)
            .then(function (widget) {
                res.send(widget);
            }, function (error) {
                res.sendStatus(400);
            });
    }
    
    function updateWidget(req, res) {
        var wId = req.params.widgetId;
        var newWidget = req.body;
        
        model
            .widgetModel
            .updateWidget(wId, newWidget)
            .then(function(stats){
                newWidget._id = widgetId;
                res.json(newWidget);
            }, function(error){
                res.sendStatus(404);
            });
    }
    
    function deleteWidget(req, res) {
        var wId = req.params.widgetId;
        model
            .widgetModel
            .findWidgetById(wId)
            .then(function (widget) {
                removeWidgetFromPages(widget.pageId, wId);
                return widget;
            }, function (error) {
                console.log("Error deleting widget");
            }).then(function (widgetId) {
            model
                .widgetModel
                .deleteWidget(widgetId)
                .then(function (status) {
                    res.sendStatus(200);
                    return widgetId;
                }, function (error) {
                    res.sendStatus(400);
                });
        });
    }

    function removeWidgetFromPages(pageId, widgetId) {
        model
            .pageModel
            .findPageById(pageId)
            .then(function (page) {
                var index = page.widgets.indexOf(widgetId);
                if(index > -1){
                    page.widgets.splice(index, 1);
                    page.save();
                }else{
                    console.log("Index not found");
                }
            }, function (error) {
                console.log("Error removing widget from page");
            });
    }

    function uploadImage(req, res) {
        var widgetId = req.body.widgetId;
        var pageId = req.body.pageId;
        var userId = req.body.userId;
        var websiteId = req.body.userId;

        var width = req.body.width;
        var myFile = req.file;

        if(myFile) {
            var originalname = myFile.originalname; // file name on user's computer
            var filename = myFile.filename;     // new file name in upload folder
            var path = myFile.path;         // full path of uploaded file
            var destination = myFile.destination;  // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;

            var newWidget = req.body;
            if(width == ''){
                width = "100%";
            }
            newWidget.width = width;
            newWidget.name = req.body.name;
            newWidget.text = req.body.text;
            newWidget.pageId = pageId.toString();
            newWidget.widgetType = "IMAGE";
            newWidget.url = "/uploads/" + filename;

            if(newWidget._id){
                model.widgetModel
                    .updateWidget(newWidget._id, newWidget)
                    .then(function(stats){
                        res.sendStatus(200);
                    }, function(error){
                        res.sendStatus(404);
                    });
                res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/" + newWidget._id);
            }
            else{
                delete newWidget._id;
                model.widgetModel
                    .findHighestOrder(pageId)
                    .then(function (doc){
                        var orderX = -1;
                        if(doc && doc.order){
                            orderX = doc.order + 1;
                        }
                        else{
                            orderX = 1;
                        }
                        newWidget.order = orderX;
                        return orderX;
                    }, function (err){
                        res.sendStatus(404);
                    })
                    .then(function(number) {
                        model.widgetModel
                            .createWidget(newWidget.pageId, newWidget)
                            .then(function (widget) {
                                newWidget._id = widget._id;
                                res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widget._id);
                            }, function (error) {
                                console.log("Error creating widget.");
                            });
                    });
            }
        }
        else {
            res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/" + widgetId);
        }
    }

    function sortablewidgets(req,res){
        var pageId = req.params.pageId;
        var initial=req.query.start;
        var final=req.query.end;
        model
            .widgetModel
            .reorderWidgets(pageId, initial, final)
            .then(function (widgets) {
                res.sendStatus(200);
            });
    }
};