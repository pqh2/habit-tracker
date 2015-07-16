
angular.module('login.ctrl', ['login.services'])
.controller('LoginCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function LoginCtrl($scope, $location, $window, UserService, AuthenticationService) {
 
        //Admin User Controller (login, logout)
        $scope.logIn = function logIn(username, password) {
            if (username !== undefined && password !== undefined) {
 
                UserService.logIn(username, password).success(function(data) {
                    AuthenticationService.isLogged = true;
                    $window.sessionStorage.token = data.token;
					$window.sessionStorage.userid = data.userid;
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }
 
        $scope.logout = function logout() {
            if (AuthenticationService.isLogged) {
                AuthenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                $location.path("login/");
            }
        }
		
        $scope.signUp = function signUp(username, password) {
            if (username !== undefined && password !== undefined) {
 
                UserService.signUp(username, password).success(function(data) {
                    AuthenticationService.isLogged = true;
                    $window.sessionStorage.token = data.token;
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }
    }
]);