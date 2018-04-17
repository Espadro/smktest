app.controller('UserStatusCtrl', ['$scope', function ($scope){
        /* If user logged show 'sign out' button */
    if(localStorage['token'] && localStorage['username']){
        $scope.username = localStorage['username'];
        $scope.status = true;
    }
    else{
        $scope.status = false;
    }
        /* When user logged show 'sign out' button */
    $scope.$on('UserStatus', function (event, userInfo){
        $scope.username = userInfo.username;
        $scope.status = userInfo.status;
    });

    $scope.exit = function (){
        $scope.status = false;
        localStorage.clear();
    };

}]).controller('LoginCtrl', ['$scope', 'RegistrationService', function ($scope, RegistrationService){

    $scope.entry = function(name, pass, checked) {
        RegistrationService(name, pass, checked, $scope);
    };

}]);

app.controller('ProductsCtrl', ['$scope', '$routeParams', 'ProductsService', 'CacheDataService', function($scope, $routeParams, ProductsService, CacheDataService){

    $scope.prod = CacheDataService.get('allProd');

    if(!$scope.prod && !$routeParams.productKey){
        ProductsService.getAllProducts().then( function (){
            $scope.prod = CacheDataService.get('allProd');
        });
    }

    if($routeParams.productKey){
        if(!CacheDataService.get('allProd')){
            ProductsService.getAllProducts().then( function (){
                $scope.product = CacheDataService.get('allProd')[$routeParams.productKey];
                ProductsService.getProductDetails($scope.product['id']).then( function (reviews){
                    $scope.product.reviews = reviews;
                });
            });
        }
        else{
            $scope.product = CacheDataService.get('allProd')[$routeParams.productKey];
            ProductsService.getProductDetails($scope.product['id']).then( function (reviews){
                $scope.product.reviews = reviews;
            });
        }
    }

}]);

app.controller('CommentCtrl', ['$scope', 'CommentService', function ($scope, CommentService){
   
    $scope.comment = function (rate, text, productId){
        CommentService(rate, text, productId).then(function (warn){
            $scope.warn = warn;
        });
    };

}]);