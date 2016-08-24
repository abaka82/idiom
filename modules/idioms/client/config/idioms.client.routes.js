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
      })
      .state('idioms.view', {
        url: '/:idiomId',
        templateUrl: 'modules/idioms/client/views/view-idiom.client.view.html',
        controller: 'IdiomsController',
        controllerAs: 'vm',
        resolve: {
          idiomResolve: getIdiom,
          translationResolve: getTranslation,
          equivalentResolve: getEquivalent
        }
      });
  }

  getIdiom.$inject = ['$stateParams', 'IdiomsService'];

  function getIdiom($stateParams, IdiomsService) {
    return IdiomsService.get({
      idiomId: $stateParams.idiomId
    }).$promise;
  }

  getTranslation.$inject = ['$stateParams', 'TranslationsService'];

  function getTranslation($stateParams, TranslationsService) {
    return TranslationsService.get({
      translationId: $stateParams.translationId
    }).$promise;
  }

  getEquivalent.$inject = ['$stateParams', 'EquivalentsService'];

  function getEquivalent($stateParams, EquivalentsService) {
    return EquivalentsService.get({
      equivalentId: $stateParams.equivalentId
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