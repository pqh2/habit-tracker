angular.module('login.services', [])
  .service('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }
 
    return auth;
})
.service('UserService', function($http, $window) {
    return {
        logIn: function(username, password) {
            return $http.post('/api/login', {username: username, password: password});
        },
 
        logOut: function() {
 
        },
		
		testToken: function()
		{
			 return $http.post('/api/testtoken', {token: $window.sessionStorage.token});
		},
		
		signUp: function(username, password) {
			return $http.post('/api/signup', {username: username, password: password});
		}		
    }
})
.service('HabitService', function($http, $window) {
    return {
        getHabits: function() {
            return $http.post('/api/userhabits', {userid: $window.sessionStorage.userid, token: $window.sessionStorage.token});
        },	
		createHabit: function(category, name, weekpattern) {
			return $http.post('/api/createhabit', { category: category, name: name, userid: $window.sessionStorage.userid, weekpattern: weekpattern,  timeZone: new Date().getTimezoneOffset() / 60, token: $window.sessionStorage.token});
		},
		increaseHabitStreak: function(habitid) {
			return $http.post('/api/increaseHabitStreak', { habitid: habitid, token: $window.sessionStorage.token });
		}
	}
})
.service('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
 
        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },
 
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/login");
            }
 
            return $q.reject(rejection);
        }
    };
});