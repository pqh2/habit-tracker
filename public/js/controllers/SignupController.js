
angular.module('signup.ctrl', ['login.services'])
.controller('SignupCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function SignupCtrl($scope, $location, $window, UserService, AuthenticationService) {
 
        //Admin User Controller (login, logout)
        $scope.signup = function signup(username, password) {
            if (username !== undefined && password !== undefined) {
 
                UserService.signup(username, password).success(function(data) {
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