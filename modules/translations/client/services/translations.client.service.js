(function() {
  'use strict';

  angular
    .module('translations.services')
    .factory('TranslationsService', TranslationsService)
    .factory('TranslationsByIdiomService', TranslationsByIdiomService);

  TranslationsService.$inject = ['$resource'];
  TranslationsByIdiomService.$inject = ['$resource'];

  function TranslationsService($resource) {
    return $resource('api/translations/:translationId', {
      translationId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  function TranslationsByIdiomService($resource) {
    return $resource('api/getTranslationsByIdiom/:idiomId', {
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