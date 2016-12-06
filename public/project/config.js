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
            .otherwise({
            redirectTo: "/"
        });
    }
})();