
angular.module('habit.ctrl', ['login.services'])
.controller('HabitCtrl', ['$scope', '$location', '$window', 'HabitService' ,
    function HabitCtrl($scope, $location, $window, HabitService) {
		$scope.showNewHabit = false;
		$scope.habitCreateToggleBtnTxt = "Show";
		$scope.shownCategories = {};
		$scope.groupedHabits = {};
		$scope.categoryShowBtnTxt = {};
		$scope.habitDaysOfWeek = [true, true,true,true,true,true, true];
		
		$scope.toggleNewHabitCreateButton = function() {
			if ($scope.showNewHabit == false) {
				$scope.showNewHabit = true;
				$scope.habitCreateToggleBtnTxt = "Hide";
			} else {
				$scope.showNewHabit = false;
				$scope.habitCreateToggleBtnTxt = "Show";
			}
		}
		
		function groupHabitsByCategory(habits) {
			habits.forEach(function(entry) {
				if ($scope.groupedHabits[entry.category] != undefined) {
					$scope.groupedHabits[entry.category].push(entry);
				} else {
					$scope.shownCategories[entry.category] = false;
					$scope.categoryShowBtnTxt[entry.category] = "+";
					$scope.groupedHabits[entry.category] = [];
					$scope.groupedHabits[entry.category].push(entry);
				}
			});
		}
		
		function isSameDateAs(dateOne, dateTwo) {
		  
		  return (dateOne != undefined &&
			dateTwo != undefined &&
			dateOne.getFullYear() === dateTwo.getFullYear() &&
			dateOne.getMonth() === dateTwo.getMonth() &&
			dateOne.getDate() === dateTwo.getDate()
		  );
		}
		
		$scope.toggleCategory = function toggleCategory(category) {
			$scope.shownCategories[category] = !$scope.shownCategories[category];
			$scope.categoryShowBtnTxt[category] = ($scope.categoryShowBtnTxt[category] === "+" ? "-" : "+");
		}
		
		$scope.getHabits = function getHabits() {
			HabitService.getHabits().success(function(data) {
				groupHabitsByCategory(data);
			}).error(function(status, data) {
				
			});
			
		};
		
		$scope.createHabit = function createHabit(habitCategory, habitName) {
			var weekPattern = "";
			for (var i = 0; i < 7; i++) {
				weekPattern += ($scope.habitDaysOfWeek[i] ? "1" : "0");
			}
			
			HabitService.createHabit(habitCategory, habitName, weekPattern).success(function(data) {
				
			}).error(function(status, data) {
			})
			
		}
		
		$scope.increaseHabitStreak = function increaseHabitStreak(habitID) {
			HabitService.increaseHabitStreak(habitID);
		}
		
		$scope.doneAlready = function(date) {
			var modelDate = new Date(date);
			var now = new Date(); 
			var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
			return isSameDateAs(modelDate, now_utc);
		}
		$scope.getHabits();
	}
]);