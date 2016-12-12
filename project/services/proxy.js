module.exports = function (app) {
    var http = require('http');

    app.get("/api/google/search/:keywords", findSearchResultsByKeywords);
    
    function findSearchResultsByKeywords(req, res) {
        var key = 'AIzaSyABe0JiGEryUQQsl_MLJPtDt-9IaKz5WRQ';
        var keywords = 'attractions+in+'+req.params.keywords;
        var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+keywords+"&key="+key;
        // var options = {
        //     host: 'https://maps.googleapis.com',
        //     path: '/maps/api/place/textsearch/json?query='+req.params.keywords+'&key='+key
        // };

        callback = function (response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(str);
            });
        };

        return http.request(url, callback).end();
    }
};