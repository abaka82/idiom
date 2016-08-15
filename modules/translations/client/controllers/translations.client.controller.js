(function() {
  'use strict';

  angular
    .module('translations')
    .controller('TranslationsController', TranslationsController);

  TranslationsController.$inject = ['$http', '$scope', '$state', 'translationResolve', 'Authentication'];

  function TranslationsController($http, $scope, $state, translation, Authentication) {
    var vm = this;

    vm.translation = translation;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Translation
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.translation.$remove($state.go('translations.list'));
      }
    }

    // Save Translation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.translationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.translation.id) {
        vm.translation.$update(successCallback, errorCallback);
      } else {
        vm.translation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('translations.view', {
          translationId: res.id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }
  }
})();