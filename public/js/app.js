'use strict';

var app = angular.module('sampleApp', ['ngRoute', 'appRoutes', 'login.ctrl', 'home.ctrl', 'habit.ctrl', 'login.services', 'mymodal']);


app.run(function($rootScope, $location, AuthenticationService, UserService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if (!angular.isUndefined(nextRoute) && !angular.isUndefined(nextRoute.access) && nextRoute.access.requiredLogin && !AuthenticationService.isAuthenticated) {
            
			UserService.testToken().success(function(data) {
				AuthenticationService.isLogged = true;
			})
			.error(function(data) {
				$location.path("/login");
			});
        }
    });
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});