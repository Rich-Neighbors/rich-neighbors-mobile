angular.module('app')
	.controller('tabsControllerCtrl', function($scope, $state, $ionicHistory) {
		console.log('tabs Controller');

		$scope.goto = function(page){
				//$ionicHistory.goBack(-10);
				// $ionicHistory.nextViewOptions({
	   //  		historyRoot: true
				// });
		};

	});