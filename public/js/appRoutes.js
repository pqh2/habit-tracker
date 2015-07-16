angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})

		.when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegisterCtrl'
		})

		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'HabitCtrl',
			access: { requiredLogin: true }
		})
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HabitCtrl',
			access: { requiredLogin: true }
		});
	$locationProvider.html5Mode(true);

}]);