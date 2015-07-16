
angular.module('habit.ctrl', ['login.services'])
.controller('HabitCtrl', ['$scope', '$location', '$window', 'HabitService' ,
    function HabitCtrl($scope, $location, $window, HabitService) {
	
		$scope.groupedHabits = {};
		function groupHabitsByCategory(habits) {
			habits.forEach(function(entry) {
				if ($scope.groupedHabits[entry.category] != undefined) {
					$scope.groupedHabits[entry.category].push(entry.name);
				} else {
					$scope.groupedHabits[entry.category] = [];
					$scope.groupedHabits[entry.category].push(entry.name);
				}
			});
		}
		
		$scope.getHabits = function getHabits() {
			HabitService.getHabits().success(function(data) {
				groupHabitsByCategory(data);
			}).error(function(status, data) {
				
			});
			
		};
		
		$scope.createHabit = function createHabit(habitCategory, habitName) {
			HabitService.createHabit(habitCategory, habitName).success(function(data) {
				
			}).error(function(status, data) {
			})
			
		}
		
		$scope.getHabits();
	}
]);