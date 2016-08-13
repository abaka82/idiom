(function () {
  'use strict';

  describe('Idioms Route Tests', function () {
    // Initialize global variables
    var $scope,
      IdiomsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _IdiomsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      IdiomsService = _IdiomsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('idioms');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/idioms');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          IdiomsController,
          mockIdiom;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('idioms.view');
          $templateCache.put('modules/idioms/client/views/view-idiom.client.view.html', '');

          // create mock idiom
          mockIdiom = new IdiomsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Idiom about PEAN',
            content: 'PEAN is great!',
            userId: '1'
          });

          //Initialize Controller
          IdiomsController = $controller('IdiomsController as vm', {
            $scope: $scope,
            idiomResolve: mockIdiom
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:idiomId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.idiomResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            idiomId: 1
          })).toEqual('/idioms/1');
        }));

        it('should attach an idiom to the controller scope', function () {
          expect($scope.vm.idiom.id).toBe(mockIdiom.id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/idioms/client/views/view-idiom.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          IdiomsController,
          mockIdiom;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('idioms.create');
          $templateCache.put('modules/idioms/client/views/form-idiom.client.view.html', '');

          // create mock idiom
          mockIdiom = new IdiomsService();

          //Initialize Controller
          IdiomsController = $controller('IdiomsController as vm', {
            $scope: $scope,
            idiomResolve: mockIdiom
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.idiomResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/idioms/create');
        }));

        it('should attach an idiom to the controller scope', function () {
          expect($scope.vm.idiom.id).toBe(mockIdiom.id);
          expect($scope.vm.idiom.id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/idioms/client/views/form-idiom.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          IdiomsController,
          mockIdiom;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('idioms.edit');
          $templateCache.put('modules/idioms/client/views/form-idiom.client.view.html', '');

          // create mock idiom
          mockIdiom = new IdiomsService({
            id: '1234',
            title: 'An Idiom about PEAN',
            content: 'PEAN is great!',
            userId: '1'
          });

          //Initialize Controller
          IdiomsController = $controller('IdiomsController as vm', {
            $scope: $scope,
            idiomResolve: mockIdiom
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:idiomId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.idiomResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            idiomId: 1
          })).toEqual('/idioms/1/edit');
        }));

        it('should attach an idiom to the controller scope', function () {
          expect($scope.vm.idiom.id).toBe(mockIdiom.id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/idioms/client/views/form-idiom.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
