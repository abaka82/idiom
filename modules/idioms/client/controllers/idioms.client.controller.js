(function() {
  'use strict';

  angular
    .module('idioms')
    .controller('IdiomsController', IdiomsController);

  IdiomsController.$inject = ['$http', '$scope', '$state', 'idiomResolve', 'Authentication'];

  function IdiomsController($http, $scope, $state, idiom, Authentication) {
    var vm = this;

    vm.idiom = idiom;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Idiom
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.idiom.$remove($state.go('idioms.list'));
      }
    }

    // Save Idiom
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.idiomForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.idiom.id) {
        vm.idiom.$update(successCallback, errorCallback);
      } else {
        vm.idiom.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('idioms.view', {
          idiomId: res.id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }
  }
})();