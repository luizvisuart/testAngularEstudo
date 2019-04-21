var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', function ($rootScope, $scope, $timeout) {

    $scope.title = "Testing AngularJS Applications";

    $scope.destinations = [];
    $scope.apiKey = "61bf8f337619c5a835d6551db63dd5d9";

    $scope.newDestination = {
        city: undefined,
        country: undefined
    };

    $scope.addDestination = function () {
        $scope.destinations.push(
            {
                city: $scope.newDestination.city,
                country: $scope.newDestination.country
            }
        );
    };

    $scope.removeDestination = function (index) {
        $scope.destinations.splice(index, 1);
    };

    $rootScope.messageWatcher = $rootScope.$watch('message', function () {
        if ($rootScope.message) {
            $timeout(function () {
                $rootScope.message = null;
            }, 3000);
        }
    });

});

testingAngluarApp.filter('warmestDestinations', function () {
    return function (destinations, minimunTemp) {
        var warmestDestinations = [];
        angular.forEach(destinations, function (destination) {
            if (destination.weather && destination.weather.temp && destination.weather.temp >= minimunTemp) {
                warmestDestinations.push(destination);
            }
        });
        return warmestDestinations;
    }
});

testingAngluarApp.directive('destinationDirective', function () {
    return {
        scope: {
            destination: '=',
            apiKey: '=',
            onRemove: '&'
        },
        template:
            '<span>{{ destination.city }}, {{ destination.country }} </span>' +
            '<span ng-if="destination.weather">{{ destination.weather.main }},{{ destination.weather.temp }}</span>' +
            '<button ng-click="onRemove()">Remove</button>' +
            '<button ng-click="getWeather(destination)">Update Tempo</button>',
        controller: function ($http, $rootScope, $scope, conversionService) {
            $scope.getWeather = function (destination) {
                $http.get("http://api.openweathermap.org/data/2.5/weather?q=" + destination.city + "&appid=" + $scope.apiKey).then(function successCallback(response) {
                    if (response.data.weather) {
                        destination.weather = {};
                        destination.weather.main = response.data.weather[0].main;
                        destination.weather.temp = conversionService.converterKelvinToCelsius(response.data.main.temp);
                    }
                }, function errorCallback(error) {
                    // $rootScope.message = error.data.message;
                    $rootScope.message = "Error";
                })
            };

        }
    }
});

testingAngluarApp.service('conversionService', function () {

    this.converterKelvinToCelsius = function (temp) {
        return Math.round(temp - 273);
    }

    return this;

});
