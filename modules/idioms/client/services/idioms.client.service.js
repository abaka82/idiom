(function() {
  'use strict';

  angular
    .module('idioms.services')
    .factory('IdiomsService', IdiomsService)
    .factory('PrevIdiomService', PrevIdiomService)
    .factory('NextIdiomService', NextIdiomService)
    .factory('RandomIdiomService', RandomIdiomService)
    .factory('FirstIdiomService', FirstIdiomService);

  IdiomsService.$inject = ['$resource'];
  PrevIdiomService.$inject = ['$resource'];
  NextIdiomService.$inject = ['$resource'];
  RandomIdiomService.$inject = ['$resource'];
  FirstIdiomService.$inject = ['$resource'];

  function IdiomsService($resource) {
    return $resource('api/idioms/:idiomId', {
      idiomId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  function PrevIdiomService($resource) {
    return $resource('api/getPrevIdiom/:idiomId', {
      idiomId: '@idiomId'
    }, {
      get : {
        method: 'GET',
        isArray: false
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

  function RandomIdiomService($resource) {
    return $resource('api/getRandomIdiom/:idiomId', {
      idiomId: '@idiomId'
    }, {
      get : {
        method: 'GET',
        isArray: false
      }
    });
  }

  function FirstIdiomService($resource) {
    return $resource('api/getFirstIdiom/:idiomId', {
      idiomId: '@idiomId'
    }, {
      get : {
        method: 'GET',
        isArray: false
      }
    });
  }
})();