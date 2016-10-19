(function() {
  'use strict';

  angular
    .module('idioms.services')
    .factory('IdiomsService', IdiomsService)
    .factory('NextIdiomService', NextIdiomService);

  IdiomsService.$inject = ['$resource'];
  NextIdiomService.$inject = ['$resource'];

  function IdiomsService($resource) {
    return $resource('api/idioms/:idiomId', {
      idiomId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  function NextIdiomService($resource) {
    return $resource('api/getNextIdiom/:idiomId', {
      idiomId: '@idiomId'
    }, {
      get : {
        method: 'GET',
        isArray: false
      }
    });
  }
})();