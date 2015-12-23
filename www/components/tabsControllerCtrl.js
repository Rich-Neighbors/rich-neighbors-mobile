angular.module('app')
	.controller('tabsControllerCtrl', function($scope, $state) {
		console.log('tabs Controller');

		$scope.goto = function(page){
			if (page === 'createCampaign'){
				$state.go('tabsController.createCampaign');
			}
		};

	});