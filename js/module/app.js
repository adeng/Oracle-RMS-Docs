(function() {
	var home = angular.module('main', ['ui.bootstrap', 'ui.router', 'ngFileUpload', 'main.controllers', 'main.services'])
	
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

		.state('process', {
			url: '/docs/:app',
			templateUrl: 'templates/documentation/navigation/process.html',
			controller: 'DocsProcessCtrl'
		})

		.state('control', {
			url: '/docs/:app/:process',
			templateUrl: 'templates/documentation/navigation/control.html',
			controller: 'DocsControlCtrl'
		})

		.state('control-selected', {
			url: '/docs/:app/:process/:controlid',
			templateUrl: 'templates/documentation/index.html',
			controller: 'DocsControlSelectedCtrl'
		});
		
		$urlRouterProvider.otherwise("/");
	});
})();
