'use strict';

app.factory('CacheDataService', ['$cacheFactory', function ($cacheFactory){
    return $cacheFactory('productsCache', {});
}]);

app.factory('RegistrationService', ['$http', '$location', 'API_BASE_URL', function ($http, $location, API_BASE_URL){

    return function (name, pass, checked, scope){
        (checked) ? scope.action = 'login/' : scope.action = 'register/';

        if( (name || pass) == undefined ){
            return scope.warn = "Please fill the form";
        }

        return $http({
            method: 'POST',
            url: API_BASE_URL + scope.action,
            data: {
                username: name,
                password: pass
            }
        }).then(function successCallback(response){
            if( response.data.token !== undefined && response.data.success ){

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', name);
                var userInfo = {'status': true, 'username': name};
                scope.$emit('UserStatus', userInfo);
                $location.url('/products');
                
            }
            else{
                scope.warn = response.data.message;
            }
        }, function errorCallBack(response){
            scope.warn = "Status code: " +response.status+ " (" +response.statusText+ ")";
        });
    };

}]);

app.factory('ProductsService', ['$http', 'API_BASE_URL', 'CacheDataService', function ($http, API_BASE_URL, CacheDataService){

    return {
        getAllProducts: function (){
            return $http({
                method: 'GET',
                url: API_BASE_URL+ 'products/'
            }).then(function successCallback(response){
                return CacheDataService.put('allProd', response.data);
            }, function errorCallBack(response){
                console.warn(response.status+ "\r\n" +response.statusText);
            });
        },
        getProductDetails: function (id){
            return $http({
                method: 'GET',
                url: API_BASE_URL+ 'reviews/' +id
            }).then(function successCallback(response){
                let reviews;
                return reviews = response.data.reverse();
            }, function errorCallBack(response){
                console.warn(response.status+ "\r\n" +response.statusText);
            });
        }
    }

}]);

app.factory('CommentService', ['$http', '$route', 'API_BASE_URL', function ($http, $route, API_BASE_URL){

    return function (rate, text, productId){
        return $http({
            method: 'POST',
            url: API_BASE_URL+ 'reviews/' +productId,
            headers:{'Authorization': 'Token ' +localStorage['token']},
            data: {"rate": rate, "text": text}
        }).then(function successCallback(){
            $route.reload();
        }, function errorCallBack(response){
            if(!localStorage.token){
                let warn;
                return warn = "Only logged users can send comments";
            }
            else{
                let warn;
                return warn = "Status code: " +response.status+ " (" +response.statusText+ ")";
            }
        });
    }

}]);