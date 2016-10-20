(function() {
  'use strict';

  angular
    .module('idioms')
    .controller('IdiomsViewController', IdiomsViewController);

  IdiomsViewController.$inject = ['idiomResolve', 'newTranslationResolve', 'newEquivalentResolve',
                              'getTranslationResolve', 'getEquivalentResolve',
                              'toastr', '$uibModal',
                              'TranslationsByIdiomService', 'EquivalentsByIdiomService',
                              'PrevIdiomService', 'NextIdiomService', 'RandomIdiomService'];

  function IdiomsViewController(idiom, translation, equivalent,
                            getTranslationResolve, getEquivalentResolve,
                            toastr, $uibModal,
                            TranslationsByIdiomService, EquivalentsByIdiomService,
                            PrevIdiomService, NextIdiomService, RandomIdiomService) {
    var vm = this;

    vm.idiom = idiom;
    vm.translationsByIdiom = getTranslationResolve;
    vm.equivalentsByIdiom = getEquivalentResolve;

    vm.show121 = false;
    vm.showEquiv = false;
    vm.showMeaning = false;
    vm.showDerivation = false;

    vm.prev = function () {
      PrevIdiomService.get({ idiomId: vm.idiom.id }).$promise
      .then(function (res) {
        vm.isFirst = false;
        vm.isLast = false;

        if (res.id) {
          vm.idiom = res;
          getTranslation();
          getEquivalent();

          // default image if not supplied
          if (!vm.idiom.imageURL) {
            vm.idiom.imageURL = 'modules/idioms/client/img/no-image.png';
          }
        } else {
          vm.isFirst = true;
        }
      }, function(res) {
         console.log('res: '+JSON.stringify(res));
        toastr.error('Error when retrieve prev idiom : '+res.data.message);
      });
    };

    vm.next = function () {
      NextIdiomService.get({ idiomId: vm.idiom.id }).$promise
      .then(function (res) {
        vm.isFirst = false;
        vm.isLast = false;
        console.log('res: '+JSON.stringify(res));
        if (res.id) {
          vm.idiom = res;
          getTranslation();
          getEquivalent();

          // default image if not supplied
          if (!vm.idiom.imageURL) {
            vm.idiom.imageURL = 'modules/idioms/client/img/no-image.png';
          }
        } else {
          vm.isLast = true;
        }
      }, function(res) {
        toastr.error('Error when retrieve next idiom : '+res.data.message);
      });
    };

    vm.random = function () {
      RandomIdiomService.get({ idiomId: vm.idiom.id }).$promise
      .then(function (res) {
        vm.isFirst = false;
        vm.isLast = false;

        vm.idiom = res;

        // default image if not supplied
        if (!vm.idiom.imageURL) {
          vm.idiom.imageURL = 'modules/idioms/client/img/no-image.png';
        }

        getTranslation();
        getEquivalent();

      }, function(res) {
        toastr.error('Error when retrieve random idiom : '+res.data.message);
      });
    };

    // --------Start Image functions ------------
    if (!vm.idiom.imageURL) {
      vm.imageURL = 'modules/idioms/client/img/no-image.png';
    } else {
      vm.imageURL = vm.idiom.imageURL;
    }

    // open Modal function
    vm.openModal = function (url) {
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/idioms/client/views/idiom-pic.client.view.html',
        controller: function ($scope, $uibModalInstance) {
          $scope.url = url;
          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }
      });
    };

    // --------End Image functions ------------


    // --------Start 121 Translations functions ------------

    // get all translation based on idiom id
    function getTranslation() {
      TranslationsByIdiomService.query({ idiomId : vm.idiom.id })
      .$promise.then(function (res) {
        vm.translationsByIdiom = res;
      }, function(res) {
        toastr.error('Error when retrieve translation : '+res.data.message);
      });
    }

    // --------End 121 Translations functions ------------


    // --------Start Equivalent Translations functions ------------

    // get all equivalent translation based on idiom id
    function getEquivalent() {
      EquivalentsByIdiomService.query({ idiomId : vm.idiom.id })
      .$promise.then(function (res) {
        vm.equivalentsByIdiom = res;
      }, function(res) {
        toastr.error('Error when retrieve equivalent : '+res.data.message);
      });
    }

    // --------End EquivalentId Translations functions ------------

  }
})();