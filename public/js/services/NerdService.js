angular.module('NerdService', []).service('Nerd', ['$http', function($http) {
	 
        // call to get all nerds
        this.get = function(callback) {
            return $http.get('/api/nerds')
			.success(function(data, status, headers, config) {
				callback(data, status);
			}).
			error(function(data, status, headers, config) {
				callback(data, status);
			});;
        };


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        this.create = function(nerdData) {
            return $http.post('/api/nerds', nerdData);
        }

        // call to DELETE a nerd
        this.delete = function(id) {
            return $http.delete('/api/nerds/' + id);
        };
        
	

}]);