(function () {
    angular
        .module("WebAppMaker")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/",{
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/login",{
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register",{
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedIn: checkLoggedIn }
            })
            .when("/user/:uid",{
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
            .when("/user/:uid/website",{
                templateUrl: "views/website/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/new",{
                templateUrl: "views/website/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model"
            })

            .when("/user/:uid/website/:wid",{
                templateUrl: "views/website/website-edit.view.client.html",
                controller: "WebsiteEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page",{
                templateUrl: "views/pages/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/new",{
                templateUrl: "views/pages/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid",{
                templateUrl: "views/pages/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget",{
                templateUrl: "views/widgets/widget-list.view.client.html",
                controller: "ListWidgetController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/new",{
                templateUrl: "views/widgets/widget-chooser.view.client.html",
                controller: "ChooseWidgetController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wgid",{
                templateUrl : "views/widgets/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/login"
            });
        // $q is a async library
        function checkLoggedIn(UserService, $location, $q, $rootScope) {
            var deferred = $q.defer();
            UserService
                .loggedIn()
                .success(
                    function (response) {
                        var user = response;
                        if(user){
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        }else{
                            deferred.reject();
                            $rootScope.currentUser = null;
                            deferred.reject();
                            $location.url("/login");
                        }
                    },
                    function (err) {
                        $location.url("/login");
                    }
                );
            return deferred.promise;
        }
    }
})();