(function() {
  'use strict';

  angular
    .module('idioms.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('idioms', {
        abstract: true,
        url: '/idioms',
        template: '<ui-view/>'
      })
      .state('idioms.list', {
        url: '',
        templateUrl: 'modules/idioms/client/views/list-idioms.client.view.html',
        controller: 'IdiomsListController',
        controllerAs: 'vm'
      })
      .state('idioms.create', {
        url: '/create',
        templateUrl: 'modules/idioms/client/views/form-idiom.client.view.html',
        controller: 'IdiomsController',
        controllerAs: 'vm',
        resolve: {
          idiomResolve: newIdiom,
          translationResolve: newTranslation,
          equivalentResolve: newEquivalent
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('idioms.edit', {
        url: '/:idiomId/edit',
        templateUrl: 'modules/idioms/client/views/form-idiom.client.view.html',
        controller: 'IdiomsController',
        controllerAs: 'vm',
        resolve: {
          idiomResolve: getIdiom,
          translationResolve: getTranslation,
          equivalentResolve: getEquivalent
        },
        data: {
          roles: ['user', 'admin']
        }
      });
  }

  getIdiom.$inject = ['$stateParams', 'IdiomsService'];

  function getIdiom($stateParams, IdiomsService) {
    return IdiomsService.get({
      idiomId: $stateParams.idiomId
    }).$promise;
  }

  getTranslation.$inject = ['$stateParams', 'TranslationsByIdiomService'];

  function getTranslation($stateParams, TranslationsByIdiomService) {
    return TranslationsByIdiomService.query({
      idiomId: $stateParams.idiomId
    }).$promise;
  }

  getEquivalent.$inject = ['$stateParams', 'EquivalentsByIdiomService'];

  function getEquivalent($stateParams, EquivalentsByIdiomService) {
    return EquivalentsByIdiomService.query({
      idiomId: $stateParams.idiomId
    }).$promise;
  }

  newIdiom.$inject = ['IdiomsService'];

  function newIdiom(IdiomsService) {
    return new IdiomsService();
  }

  newTranslation.$inject = ['TranslationsService'];

  function newTranslation(TranslationsService) {
    return new TranslationsService();
  }

  newEquivalent.$inject = ['EquivalentsService'];

  function newEquivalent(EquivalentsService) {
    return new EquivalentsService();
  }
})();