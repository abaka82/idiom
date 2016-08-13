(function () {
  'use strict';

  describe('Idioms List Controller Tests', function () {
    // Initialize global variables
    var IdiomsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      IdiomsService,
      mockIdiom;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _IdiomsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      IdiomsService = _IdiomsService_;

      // create mock idiom
      mockIdiom = new IdiomsService({
        id: '1234',
        title: 'An Idiom about PEAN',
        content: 'PEAN is great!',
        userId: '1'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Idioms List controller.
      IdiomsListController = $controller('IdiomsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockIdiomList;

      beforeEach(function () {
        mockIdiomList = [mockIdiom, mockIdiom];
      });

      it('should send a GET request and return all idioms', inject(function (IdiomsService) {
        // Set POST response
        $httpBackend.expectGET('api/idioms').respond(mockIdiomList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.idioms.length).toEqual(2);
        expect($scope.vm.idioms[0]).toEqual(mockIdiom);
        expect($scope.vm.idioms[1]).toEqual(mockIdiom);

      }));
    });
  });
})();
