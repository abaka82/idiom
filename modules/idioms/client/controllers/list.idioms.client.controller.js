(function () {
  'use strict';

  angular
    .module('idioms')
    .controller('IdiomsListController', IdiomsListController);

  IdiomsListController.$inject = ['IdiomsService'];

  function IdiomsListController(IdiomsService) {
    var vm = this;

    vm.idioms = IdiomsService.query();
  }
})();
