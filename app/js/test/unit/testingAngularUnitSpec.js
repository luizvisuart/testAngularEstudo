describe("Primeiro suit para Teste", function () {

    beforeEach(function () {
        module('testingAngularApp');
    });

    describe(" - Teste AngularJS Controller - ", function () {

        var scope, controller, httpBackend, timeout;

        beforeEach(inject(function ($controller, $rootScope, $httpBackend, $timeout) {
            scope = $rootScope.$new();
            controller = $controller('testingAngularCtrl', { $scope: scope });
            httpBackend = $httpBackend;
            timeout = $timeout;
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it("Deve inicializar o titulo do scopo", function () {
            expect(scope.title).toBeDefined();
            expect(scope.title).toBe("Testing AngularJS Applications");
        });

        it("Deve adicionar dois destinos a lista de destino", function () {
            expect(scope.destinations).toBeDefined();
            expect(scope.destinations.length).toBe(0);
            expect(scope.destinations).toEqual([]);

            scope.newDestination = {
                city: "London",
                country: "England"
            };

            scope.addDestination();
            expect(scope.destinations.length).toBe(1);


            scope.newDestination = {
                city: "Frankfurt",
                country: "Germany"
            };

            scope.addDestination();
            expect(scope.destinations.length).toBe(2);
            expect(scope.destinations[0].city).toBe('London');
            expect(scope.destinations[0].country).toBe('England');
            expect(scope.destinations[1].city).toBe('Frankfurt');
            expect(scope.destinations[1].country).toBe('Germany');
        });

        it("Deve remover um destino da lista conforme o index do mesmo", function () {
            scope.destinations = [
                { city: "London", country: "England" },
                { city: "Brasília", country: "Brasil" },
                { city: "Frankfurt", country: "Germany" }
            ];

            expect(scope.destinations.length).toBe(3);

            scope.removeDestination(1);

            expect(scope.destinations.length).toBe(2);
            expect(scope.destinations[0].city).toEqual('London');
            expect(scope.destinations[1].city).toEqual('Frankfurt');
        });

        it("Deve atualizar o tempo para um destino específico", function () {
            scope.destination = {
                city: "Melbourne",
                country: "Australia"
            };
            httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&appid=" + scope.apiKey).respond(
                {
                    weather: [{ main: 'Rain', detail: 'Light rain' }],
                    main: { temp: 288 }
                }
            );
            scope.getWeather(scope.destination);
            httpBackend.flush();
            expect(scope.destination.weather.main).toBe('Rain');
            expect(scope.destination.weather.temp).toBe(15);
        });
        it("Deve verificar se removeu a mensagem após 3 segundos", function () {
            scope.message = 'Error';
            expect(scope.message).toBe("Error");
            scope.$apply();
            timeout.flush();
            expect(scope.message).toBeNull();
        });

        describe('Teste do Filtro', function () {

            it("Deve retornar apenas destinos acima de um certo grau", inject(function ($filter) {
                var warmest = $filter('warmestDestinations');
                var destinations = [
                    {
                        city: "Beijing", contry: "China", weather: { temp: 21 }
                    },
                    {
                        city: "Moscou", contry: "Russia", weather: { temp: 09 }
                    },
                    {
                        city: "Mexico City", contry: "Mexico", weather: { temp: 12 }
                    },
                    {
                        city: "Lima", contry: "Peru", weather: { temp: 15 }
                    }
                ];
                expect(destinations.length).toBe(4);
                var warmestDestinations = warmest(destinations, 15);
                expect(warmestDestinations.length).toBe(2);
                expect(warmestDestinations[0].city).toBe("Beijing");
                expect(warmestDestinations[1].city).toBe("Lima");
            }));
        });
    });
});