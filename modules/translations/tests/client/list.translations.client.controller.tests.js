(function () {
  'use strict';

  describe('Translations List Controller Tests', function () {
    // Initialize global variables
    var TranslationsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TranslationsService,
      mockTranslation;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TranslationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TranslationsService = _TranslationsService_;

      // create mock translation
      mockTranslation = new TranslationsService({
        id: '1234',
        title: 'An Translation about PEAN',
        content: 'PEAN is great!',
        userId: '1'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Translations List controller.
      TranslationsListController = $controller('TranslationsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTranslationList;

      beforeEach(function () {
        mockTranslationList = [mockTranslation, mockTranslation];
      });

      it('should send a GET request and return all translations', inject(function (TranslationsService) {
        // Set POST response
        $httpBackend.expectGET('api/translations').respond(mockTranslationList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.translations.length).toEqual(2);
        expect($scope.vm.translations[0]).toEqual(mockTranslation);
        expect($scope.vm.translations[1]).toEqual(mockTranslation);

      }));
    });
  });
})();
