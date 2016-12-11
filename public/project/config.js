(function () {
    angular
        .module("PlacesApp")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/home/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/signin", {
                templateUrl: "views/signin/signin.view.client.html",
                controller: "SignInController",
                controllerAs: "model"
            })
            .when("/signup", {
                templateUrl: "views/signup/signup.view.client.html",
                controller: "SignUpController",
                controllerAs: "model"
            })
            .when("/profile", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {loggedIn: checkLoggedIn}

            })
            .when("/profile/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {loggedIn: checkAdmin}
            })
            .when("/connections", {
                templateUrl: "views/user/connections.view.client.html",
                controller: "ConnectionsController",
                controllerAs: "model",
                resolve: {loggedIn: checkLoggedIn}

            })
            .when("/connections/view/:searchView", {
                templateUrl: "views/user/connections.view.client.html",
                controller: "ConnectionsController",
                controllerAs: "model",
                resolve: {loggedIn: checkLoggedIn}
            })
            .when("/connections/:uid", {
                templateUrl: "views/user/connections.view.client.html",
                controller: "ConnectionsController",
                controllerAs: "model",
                resolve: {loggedIn: checkAdmin}
            })
            .when("/connections/:uid/view/:searchView", {
                templateUrl: "views/user/connections.view.client.html",
                controller: "ConnectionsController",
                controllerAs: "model",
                resolve: {loggedIn: checkAdmin}
            })
            .when("/discover", {
                templateUrl: "views/user/discover.view.client.html",
                controller: "DiscoverController",
                controllerAs: "model",
                resolve: {loggedIn: checkLoggedIn}
            })
            .when("/discover/:uid", {
                templateUrl: "views/user/discover.view.client.html",
                controller: "DiscoverController",
                controllerAs: "model",
                resolve: {loggedIn: checkAdmin}
            })
            .when("/details/:placeId", {
                templateUrl: "views/user/detail.view.client.html",
                controller: "DetailsController",
                controllerAs: "model"
            })
            .when("/recommendation", {
                templateUrl: "views/user/recommendation.view.client.html",
                controller: "RecommendationController",
                controllerAs: "model",
                resolve: {loggedIn: checkLoggedIn}
            })
            .when("/recommendation/:uid", {
                templateUrl: "views/user/recommendation.view.client.html",
                controller: "RecommendationController",
                controllerAs: "model",
                resolve: {loggedIn: checkLoggedIn}
            })
            .when("/recommendation/:uid/as/:otherid", {
                templateUrl: "views/user/recommendation.view.client.html",
                controller: "RecommendationController",
                controllerAs: "model",
                resolve: {loggedIn: checkAdmin}
            })
            .when("/admin", {
                templateUrl: "views/admin/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {loggedIn: checkAdmin}
            })
            .when("/account",{
                templateUrl: "views/user/account.view.client.html",
                controller : "AccountController",
                controllerAs : "model",
                resolve: { loggedIn: checkLoggedIn }
            })
            .when("/account/:uid",{
                templateUrl: "views/user/account.view.client.html",
                controller : "AccountController",
                controllerAs : "model",
                resolve: { loggedIn: checkAdmin }
            })
            .otherwise({
                redirectTo: "/signin"
            });
        
        function checkLoggedIn(TravelYaarUserService, $location, $q, $rootScope) {
            var deferred = $q.defer();

            TravelYaarUserService
                .loggedIn()
                .then(
                    function (response) {
                        var user = response.data;
                        if (user){
                            console.log(user);
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        } else {
                            console.log(user);
                            $rootScope.currentUser = null;
                            deferred.reject();
                            $location.url("/signin");
                        }
                    },
                    function (err) {
                        $location.url("/signin");
                    }
                );
            return deferred.promise;
        }

        function checkAdmin(TravelYaarUserService, $location, $q, $rootScope) {
            var deferred = $q.defer();

            TravelYaarUserService
                .loggedIn()
                .then(
                    function (response) {
                        var user = response.data;
                        if (user && user.role=="admin"){
                            console.log(user);
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        } else {
                            console.log(user);
                            $rootScope.currentUser = null;
                            deferred.reject();
                            $location.url("/signin");
                        }
                    },
                    function (err) {
                        $location.url("/signin");
                    }
                );
            return deferred.promise;
        }
    }
})();