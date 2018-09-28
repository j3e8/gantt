angular.module('app', ['ngAnimate', 'ngRoute']);

angular.module('app').config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true, requireBase: false });

  $routeProvider
  .when('/', {
    templateUrl: '/pages/dashboard/dashboard.html',
    controller: 'dashboardController'
  })
  .when('/signin', {
    templateUrl: '/pages/signin/signin.html',
    controller: 'signinController'
  })
  .when('/projects', {
    templateUrl: '/pages/projects/projects.html',
    controller: 'projectsController'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);


angular.module('app').run(["$rootScope",
function($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(e,to){
    window.scrollTo(0, 0);
  });
}]);
