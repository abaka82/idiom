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
          newTranslationResolve: newTranslation,
          newEquivalentResolve: newEquivalent,
          getTranslationResolve: getTranslation,
          getEquivalentResolve: getEquivalent
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
          newTranslationResolve: newTranslation,
          newEquivalentResolve: newEquivalent,
          getTranslationResolve: getTranslation,
          getEquivalentResolve: getEquivalent
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

  getTranslation.$inject = ['$stateParams', 'TranslationsService', 'TranslationsByIdiomService'];

  function getTranslation($stateParams, TranslationsService, TranslationsByIdiomService) {
    if (!$stateParams.idiomId) {
      return new TranslationsService();
    } else {
      return TranslationsByIdiomService.query({
        idiomId: $stateParams.idiomId
      }).$promise;
    }
  }

  getEquivalent.$inject = ['$stateParams', 'EquivalentsService', 'EquivalentsByIdiomService'];

  function getEquivalent($stateParams, EquivalentsService, EquivalentsByIdiomService) {
    if (!$stateParams.idiomId) {
      return new EquivalentsService();
    } else {
      return EquivalentsByIdiomService.query({
        idiomId: $stateParams.idiomId
      }).$promise;
    }
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