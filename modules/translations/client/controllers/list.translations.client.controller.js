(function () {
  'use strict';

  angular
    .module('translations')
    .controller('TranslationsListController', TranslationsListController);

  TranslationsListController.$inject = ['TranslationsService'];

  function TranslationsListController(TranslationsService) {
    var vm = this;

    vm.translations = TranslationsService.query();
  }
})();
