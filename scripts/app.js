var app = angular.module('app', ['ngRoute']);

app.constant('API_BASE_URL', 'https://smktesting.herokuapp.com/api/');

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .when('/products', {
            templateUrl: 'templates/products.html',
            controller: 'ProductsCtrl'
        })
        .when('/products/:productKey',{
            templateUrl: 'templates/product_details.html',
            controller: 'ProductsCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);