(function() {
  'use strict';

  angular
    .module('equivalents.services')
    .factory('EquivalentsService', EquivalentsService)
    .factory('EquivalentsByIdiomService', EquivalentsByIdiomService);

  EquivalentsService.$inject = ['$resource'];
  EquivalentsByIdiomService.$inject = ['$resource'];

  function EquivalentsService($resource) {
    return $resource('api/equivalents/:equivalentId', {
      equivalentId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      get : {
        method: 'GET',
        isArray: true
      }
    });
  }

  function EquivalentsByIdiomService($resource) {
    return $resource('api/getEquivalentsByIdiom/:idiomId', {
      idiomId: '@idiomId'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      get : {
        method: 'GET',
        isArray: true
      }
    });
  }
})();