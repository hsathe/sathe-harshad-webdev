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
            .when("/signin",{
                templateUrl: "views/signin/signin.view.client.html",
                controller: "SignInController",
                controllerAs: "model"
            })
            .when("/signup",{
                templateUrl: "views/signup/signup.view.client.html",
                controller: "SignUpController",
                controllerAs: "model"
            })
            .when("/profile",{
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/connections",{
                templateUrl: "views/user/connections.view.client.html",
                controller: "ConnectionsController",
                controllerAs: "model"
            })
            .when("/connections/view/:searchView", {
                templateUrl: "views/user/connections.view.client.html",
                controller: "ConnectionsController",
                controllerAs: "model"
            })
            .when("/discover", {
                templateUrl: "views/user/discover.view.client.html",
                controller: "DiscoverController",
                controllerAs: "model"
            })
            .when("/details/:placeId", {
                templateUrl: "views/user/detail.view.client.html",
                controller: "DetailsController",
                controllerAs: "model"
            })
            .when("/recommendation", {
                templateUrl: "views/user/recommendation.view.client.html",
                controller: "RecommendationController",
                controllerAs: "model"
            })
            .otherwise({
            redirectTo: "/"
        });
    }
})();