'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  
  .controller('LandingPageController',[function(){

  }])
  .controller('WaitListController',['$scope', 'partyService', 'textMessageService', 'authService',
                    function($scope, partyService, textMessageService, authService){
  		
      authService.getCurrentUser().then(function(user){
        if (user){
          $scope.parties = partyService.getPartiesByUserId(user.id);
           console.log($scope.parties);
        };
      })

  		$scope.newParty   = {name: '', phone: '', size: '', done: false, notifield: 'No'};

  		$scope.saveParty = function(){
  			partyService.saveParty($scope.newParty, $scope.currentUser.id);
  			$scope.newParty   = {name: '', phone: '', size: '', done: false, notifield: 'No'};
  		};

  		$scope.sendTextMessage = function(party){
  			textMessageService.sendTextMessage(party, $scope.currentUser.id);
  		};
  }])
  .controller('AuthController',['$scope','authService', 
                function($scope, authService){

  		$scope.user = {email: '', password: ''};

  		$scope.register = function(){
  			authService.register($scope.user);
  		};

  		$scope.login = function(){
  			authService.login($scope.user);
  		};

  		$scope.logout = function(){
  			authService.logout();
  		}
  }]);