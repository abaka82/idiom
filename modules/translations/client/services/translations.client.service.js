(function() {
  'use strict';

  angular
    .module('translations.services')
    .factory('TranslationsService', TranslationsService);

  TranslationsService.$inject = ['$resource'];

  function TranslationsService($resource) {
    return $resource('api/translations/:translationId', {
      translationId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();