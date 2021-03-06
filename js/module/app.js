(function() {
	var home = angular.module('main', ['ui.bootstrap', 'ui.router', 'ngFileUpload', 'main.controllers', 'main.services'], function($httpProvider) {
  	// Use x-www-form-urlencoded Content-Type
  	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var param = function(obj) {
	var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

	for(name in obj) {
		value = obj[name];

		if(value instanceof Array) {
		for(i=0; i<value.length; ++i) {
			subValue = value[i];
			fullSubName = name + '[' + i + ']';
			innerObj = {};
			innerObj[fullSubName] = subValue;
			query += param(innerObj) + '&';
		}
		}
		else if(value instanceof Object) {
		for(subName in value) {
			subValue = value[subName];
			fullSubName = name + '[' + subName + ']';
			innerObj = {};
			innerObj[fullSubName] = subValue;
			query += param(innerObj) + '&';
		}
		}
		else if(value !== undefined && value !== null)
		query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	}

	return query.length ? query.substr(0, query.length - 1) : query;
	};

	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
	})
	
	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider
		
		.state('home', {
			url: '/',
			templateUrl: 'templates/home/index.html',
			controller: 'MainCtrl'
		})

		.state('docs', {
			url: '/docs',
			templateUrl: 'templates/documentation/navigation/app.html',
			controller: 'DocsAppCtrl'
		})

		.state('upload', {
			url: '/upload',
			templateUrl: 'templates/upload/index.html',
			controller: 'UploadCtrl'
		})

		.state('options', {
			url: '/docs/:app',
			templateUrl: 'templates/documentation/navigation/options.html',
			controller: 'DocsOptionCtrl'
		})

		.state('process', {
			url: '/docs/:app/Processes',
			templateUrl: 'templates/documentation/navigation/process.html',
			controller: 'DocsProcessCtrl'
		})
		
		.state('risk', {
			url: '/docs/:app/Risks',
			templateUrl: 'templates/documentation/navigation/allrisks.html',
			controller: 'DocsRisksCtrl'
		})

		.state('control', {
			url: '/docs/:app/:view/:process',
			templateUrl: 'templates/documentation/navigation/control.html',
			controller: 'DocsControlCtrl'
		})

		.state('control-selected', {
			url: '/docs/:app/:view/:process/:controlid',
			templateUrl: 'templates/documentation/index.html',
			controller: 'DocsControlSelectedCtrl'
		});
		
		$urlRouterProvider.otherwise("/docs");
	});
})();
