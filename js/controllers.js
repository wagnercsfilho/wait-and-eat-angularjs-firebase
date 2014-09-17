'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  
  .controller('LandingPageController',[function(){

  }])
  .controller('WaitListController',['$scope', '$firebase', function($scope, $firebase){
  		var partiesRef = new Firebase('https://crackling-fire-6014.firebaseio.com/parties');
  		
  		$scope.parties = $firebase(partiesRef);

  		$scope.newParty   = {name: '', phone: '', size: '', done: false, notifield: 'No'};

  		$scope.saveParty = function(){
  			$scope.parties.$add($scope.newParty);
  			$scope.newParty   = {name: '', phone: '', size: '', done: false, notifield: 'No'};
  		};

  		$scope.sendTextMessage = function(party){
  			var textMessageRef = new Firebase('https://crackling-fire-6014.firebaseio.com/textMessages');
  			var textMessages = $firebase(textMessageRef);
  			var newTextMessage = {
  				phoneNumber: party.phone,
  				size: party.size,
  				name: party.name
  			};
  			textMessages.$add(newTextMessage);
  			party.notifield = 'Yes';
  			$scope.parties.$save(party.$id);
  		}
  }])
  .controller('AuthController',['$scope','$firebaseSimpleLogin', function($scope, $firebaseSimpleLogin){
  		var authRef = new Firebase('https://crackling-fire-6014.firebaseio.com/');
  		var auth    = $firebaseSimpleLogin(authRef);

  		$scope.user = {email: '', password: ''};

  		$scope.register = function(){
  			auth.$createUser($scope.user.email, $scope.user.password)
  				.then(function(data){
  					console.log(data);
  				});
  		};

  		$scope.login = function(){
  			auth.$login('password', $scope.user).then(function(data){
  				console.log(data);
  			});
  		};

  		$scope.logout() = function(){
  			auth.$logout();
  		}
  }]);