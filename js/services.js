'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('FIREBASE_URL', 'https://crackling-fire-6014.firebaseio.com/')
  .factory('dataService', function($firebase, FIREBASE_URL){
  	var dataRef 	= new Firebase(FIREBASE_URL);
  	var fireData    = $firebase(dataRef);

  	return fireData;
  })
  .factory('partyService', function(dataService){
  	var users = dataService.$child('users');

  	var partyServiceObject = {
  		saveParty: function(party, userId){
  			users.$child(userId).$child('parties').$add(party);
  		},
  		getPartiesByUserId: function(userId){
  			return users.$child(userId).$child('parties');
  		}
  	};

  	return partyServiceObject;
  })
  .factory('textMessageService', function(dataService, partyService){
  	var textMessages    = dataService.$child('textMessages');

  	var textMessageServiceObject = {
  		sendTextMessage: function(party, userId){
  			var newTextMessage = {
  				phoneNumber: party.phone,
  				size: party.size,
  				name: party.name
  			};
  			textMessages.$add(newTextMessage);
  			partyService.getPartiesByUserId(userId)
  						.$child(party.$id)
  						.$update({notifield: 'Yes'});
  		}
  	};

  	return textMessageServiceObject;

  })
  .factory('authService', function($rootScope, $firebaseSimpleLogin, $location, FIREBASE_URL, dataService){

  	var authRef = new Firebase(FIREBASE_URL);
  	var auth    = $firebaseSimpleLogin(authRef);
  	var emails  = dataService.$child('emails');
  	
  	var authServiceObject = {
  		login: function(user, optionalCallback){
	  		auth.$login('password', user).then(function(data){
	        	if (optionalCallback){
	        		optionalCallback();
	        	}
	        	$location.path('/waitlist');
	  		});
  		},
  		register: function(user){
  			auth.$createUser(user.email, user.password)
  				.then(function(data){
            		authServiceObject.login(user, function(){
            			emails.$add({email: user.email});
            		});
  				});
  		},
  		logout: function(){
  			auth.$logout();
  			$location.path('/');
  		},
  		getCurrentUser: function(){
  			return auth.$getCurrentUser();
  		}
  	};

  	$rootScope.$on('$firebaseSimpleLogin:login', function(e, user){
  		$rootScope.currentUser = user;
  	})

  	$rootScope.$on('$firebaseSimpleLogin:logout', function(e, user){
  		$rootScope.currentUser = null;
  	})

  	return authServiceObject;

  });