(function () {
  'use strict';

  describe('Idioms Controller Tests', function () {
    // Initialize global variables
    var IdiomsController,
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

      // Initialize the Idioms controller.
      IdiomsController = $controller('IdiomsController as vm', {
        $scope: $scope,
        idiomResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleIdiomPostData;

      beforeEach(function () {
        // Create a sample idiom object
        sampleIdiomPostData = new IdiomsService({
          title: 'An Idiom about PEAN',
          content: 'PEAN is great!',
          userId: '1'
        });

        $scope.vm.idiom = sampleIdiomPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (IdiomsService) {
        // Set POST response
        $httpBackend.expectPOST('api/idioms', sampleIdiomPostData).respond(mockIdiom);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the idiom was created
        expect($state.go).toHaveBeenCalledWith('idioms.view', {
          idiomId: mockIdiom.id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/idioms', sampleIdiomPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock idiom in $scope
        $scope.vm.idiom = mockIdiom;
      });

      it('should update a valid idiom', inject(function (IdiomsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/idioms\/1234$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('idioms.view', {
          idiomId: mockIdiom.id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (IdiomsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/idioms\/1234$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup idioms
        $scope.vm.idiom = mockIdiom;
      });

      it('should delete the idiom and redirect to idioms', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/idioms\/1234$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('idioms.list');
      });

      it('should should not delete the idiom and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
