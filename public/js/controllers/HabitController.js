
angular.module('habit.ctrl', ['login.services'])
.controller('HabitCtrl', ['$scope', '$location', '$window', 'HabitService' ,
    function HabitCtrl($scope, $location, $window, HabitService) {
		$scope.showNewHabit = false;
		$scope.habitCreateToggleBtnTxt = "Show";
		
		$scope.toggleNewHabitCreateButton = function() {
			if ($scope.showNewHabit == false) {
				$scope.showNewHabit = true;
				$scope.habitCreateToggleBtnTxt = "Hide";
			} else {
				$scope.showNewHabit = false;
				$scope.habitCreateToggleBtnTxt = "Show";
			}
		}
		$scope.groupedHabits = {};
		function groupHabitsByCategory(habits) {
			habits.forEach(function(entry) {
				if ($scope.groupedHabits[entry.category] != undefined) {
					$scope.groupedHabits[entry.category].push(entry);
				} else {
					$scope.groupedHabits[entry.category] = [];
					$scope.groupedHabits[entry.category].push(entry);
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
		
		$scope.increaseHabitStreak = function increaseHabitStreak(habitID) {
			HabitService.increaseHabitStreak(habitID);
		}
		
		$scope.doneAlready = function(date) {
			return date === new Date().toJSON().slice(0,10);
		}
		$scope.getHabits();
	}
]);