(function () {
  'use strict';

  describe('Translations Route Tests', function () {
    // Initialize global variables
    var $scope,
      TranslationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TranslationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TranslationsService = _TranslationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('translations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/translations');
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
          TranslationsController,
          mockTranslation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('translations.view');
          $templateCache.put('modules/translations/client/views/view-translation.client.view.html', '');

          // create mock translation
          mockTranslation = new TranslationsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Translation about PEAN',
            content: 'PEAN is great!',
            userId: '1'
          });

          //Initialize Controller
          TranslationsController = $controller('TranslationsController as vm', {
            $scope: $scope,
            translationResolve: mockTranslation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:translationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.translationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            translationId: 1
          })).toEqual('/translations/1');
        }));

        it('should attach an translation to the controller scope', function () {
          expect($scope.vm.translation.id).toBe(mockTranslation.id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/translations/client/views/view-translation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TranslationsController,
          mockTranslation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('translations.create');
          $templateCache.put('modules/translations/client/views/form-translation.client.view.html', '');

          // create mock translation
          mockTranslation = new TranslationsService();

          //Initialize Controller
          TranslationsController = $controller('TranslationsController as vm', {
            $scope: $scope,
            translationResolve: mockTranslation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.translationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/translations/create');
        }));

        it('should attach an translation to the controller scope', function () {
          expect($scope.vm.translation.id).toBe(mockTranslation.id);
          expect($scope.vm.translation.id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/translations/client/views/form-translation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TranslationsController,
          mockTranslation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('translations.edit');
          $templateCache.put('modules/translations/client/views/form-translation.client.view.html', '');

          // create mock translation
          mockTranslation = new TranslationsService({
            id: '1234',
            title: 'An Translation about PEAN',
            content: 'PEAN is great!',
            userId: '1'
          });

          //Initialize Controller
          TranslationsController = $controller('TranslationsController as vm', {
            $scope: $scope,
            translationResolve: mockTranslation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:translationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.translationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            translationId: 1
          })).toEqual('/translations/1/edit');
        }));

        it('should attach an translation to the controller scope', function () {
          expect($scope.vm.translation.id).toBe(mockTranslation.id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/translations/client/views/form-translation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
