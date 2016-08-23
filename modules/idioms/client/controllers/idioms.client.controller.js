(function() {
  'use strict';

  angular
    .module('idioms')
    .controller('IdiomsController', IdiomsController);
    /*
    .directive('ngConfirmClick', [function () {
    return {
        link: function link(scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure to delete this product??";
            var clickAction = attr.confirmedClick;
            element.bind('click', function (event) {
                if (window.confirm(msg)) {
                    console.log('msg: '-msg);
                    console.log('clickAction: '-clickAction);
                    scope.$eval(clickAction);
                }
            });
        }
    };}]);*/

  IdiomsController.$inject = ['$http', '$scope', '$timeout', '$window', '$state', 'idiomResolve', 'translationResolve','Authentication', 'FileUploader', 'TranslationsByIdiomService'];

  function IdiomsController($http, $scope, $timeout, $window, $state, idiom, translation, Authentication, FileUploader, TranslationsByIdiomService) {
    var vm = this;

    vm.idiom = idiom;
    vm.translation = translation;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveTranslation = saveTranslation;

    vm.translationsByIdiom = [];

    vm.languages = [
      { id: '1', lang: 'DE' },
      { id: '2', lang: 'EN' },
      { id: '3', lang: 'ES' },
      { id: '4', lang: 'IT' }];
    vm.selectedLang = { id: '1', lang: 'DE' }; //This sets the default value of the select in the ui
    vm.selectedTranslationLang = { id: '2', lang: 'EN' };

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

      vm.idiom.language = vm.selectedLang.lang;

      // TODO: move create/update logic to service
      if (vm.idiom.id) {
        vm.idiom.$update(successCallback, errorCallback);
      } else {
        vm.idiom.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log('success add idiom with id: '+res.id);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // --------Start Image functions ------------
    if (!vm.idiom.imageURL) {
      vm.imageURL = 'modules/idioms/client/img/no-image.png';
    } else {
      vm.imageURL = vm.idiom.imageURL;
    }

    // Create file uploader instance
    vm.uploader = new FileUploader({
      url: 'api/idioms/picture',
      alias: 'newPicture'
    });

    // Set file uploader image filter
    vm.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    vm.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      vm.success = true;

      // Populate user object
      vm.user = Authentication.user = response;

      // Clear upload buttons
      vm.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      vm.cancelUpload();

      // Show error message
      vm.error = response.message;
    };

    // Change user profile picture
    vm.uploadProfilePicture = function () {
      // Clear messages
      vm.success = $scope.error = null;

      vm.uploader.queue[0].formData.push({
        idiomId: vm.idiom.id
      });

      // Start upload
      vm.uploader.uploadAll();
    };

    // Cancel the upload process
    vm.cancelUpload = function () {
      vm.uploader.clearQueue();
      vm.imageURL = vm.idiom.imageURL;
    };

    // --------End Image functions ------------

    // --------Start 121 Translations functions ------------

    // Save 121 Translations
    function saveTranslation(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.idiomForm');
        return false;
      }

      vm.translation.language = vm.selectedTranslationLang.lang;
      vm.translation.idiomId = vm.idiom.id;

      vm.translation.$save(successCallback, errorCallback);

      function successCallback(res) {
        console.log('success add translation with id: '+res.id);

        //clear id and prepare for new translation
        vm.translation.id = '';

        //get all translation based on idiom id
        TranslationsByIdiomService.query({ idiomId : vm.idiom.id })
        .$promise.then(function (res) {
          vm.translationsByIdiom = res;
        }, function(res) {
          vm.error = res.data.message;
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    // Delete 121 Translations
    function removeTranslation(translationId) {
      console.log('translationId: '+ translationId);

      //get all translation based on idiom id
      translation.delete({ translationId : translationId })
      .$promise.then(function (res) {
        console.log('success delete');
      }, function(res) {
        console.log('serror delete');
        vm.error = res.data.message;
      });
    }

    // --------End 121 Translations functions ------------

  }
})();