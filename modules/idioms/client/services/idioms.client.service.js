(function() {
  'use strict';

  angular
    .module('idioms.services')
    .factory('IdiomsService', IdiomsService);

  IdiomsService.$inject = ['$resource'];

  function IdiomsService($resource) {
    return $resource('api/idioms/:idiomId', {
      idiomId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();