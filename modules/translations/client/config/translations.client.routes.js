(function() {
  'use strict';

  angular
    .module('translations.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('translations', {
        abstract: true,
        url: '/translations',
        template: '<ui-view/>'
      })
      .state('translations.list', {
        url: '',
        templateUrl: 'modules/translations/client/views/list-translations.client.view.html',
        controller: 'TranslationsListController',
        controllerAs: 'vm'
      })
      .state('translations.create', {
        url: '/create',
        templateUrl: 'modules/translations/client/views/form-translation.client.view.html',
        controller: 'TranslationsController',
        controllerAs: 'vm',
        resolve: {
          translationResolve: newTranslation
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('translations.edit', {
        url: '/:translationId/edit',
        templateUrl: 'modules/translations/client/views/form-translation.client.view.html',
        controller: 'TranslationsController',
        controllerAs: 'vm',
        resolve: {
          translationResolve: getTranslation
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('translations.view', {
        url: '/:translationId',
        templateUrl: 'modules/translations/client/views/view-translation.client.view.html',
        controller: 'TranslationsController',
        controllerAs: 'vm',
        resolve: {
          translationResolve: getTranslation
        }
      });
  }

  getTranslation.$inject = ['$stateParams', 'TranslationsService'];

  function getTranslation($stateParams, TranslationsService) {
    return TranslationsService.get({
      translationId: $stateParams.translationId
    }).$promise;
  }

  newTranslation.$inject = ['TranslationsService'];

  function newTranslation(TranslationsService) {
    return new TranslationsService();
  }
})();