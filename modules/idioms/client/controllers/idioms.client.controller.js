(function() {
  'use strict';

  angular
    .module('idioms')
    .controller('IdiomsController', IdiomsController);

  IdiomsController.$inject = ['$http', '$scope', '$timeout', '$window', '$state',
                              'idiomResolve', 'newTranslationResolve', 'newEquivalentResolve',
                              'getTranslationResolve', 'getEquivalentResolve',
                              'Authentication', 'FileUploader', 'toastr',
                              'TranslationsService', 'TranslationsByIdiomService',
                              'EquivalentsService', 'EquivalentsByIdiomService'];

  function IdiomsController($http, $scope, $timeout, $window, $state,
                            idiom, translation, equivalent,
                            getTranslationResolve, getEquivalentResolve,
                            Authentication, FileUploader, toastr,
                            TranslationsService, TranslationsByIdiomService,
                            EquivalentsService, EquivalentsByIdiomService) {
    var vm = this;

    vm.idiom = idiom;
    vm.translation = translation;
    vm.equivalent = equivalent;
    vm.authentication = Authentication;
    vm.error = null;
    vm.errorEquivalent = null;
    vm.errorTranslation = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveTranslation = saveTranslation;
    vm.saveEquivalent = saveEquivalent;
    vm.translationRequired = false;
    vm.equivalentRequired = false;

    vm.translationsByIdiom = getTranslationResolve;
    vm.equivalentsByIdiom = getEquivalentResolve;

    vm.languages = [
      { id: '1', lang: 'DE' },
      { id: '2', lang: 'EN' },
      { id: '3', lang: 'ES' },
      { id: '4', lang: 'IT' }];

    //Set default value of combobox in the ui
    vm.selectedLang = { id: '1', lang: 'DE' };
    vm.selectedTranslationLang = { id: '2', lang: 'EN' };
    vm.selectedEquivalentLang = { id: '2', lang: 'EN' };

    if (vm.idiom.id) {
      if (vm.idiom.language === 'DE') vm.selectedLang = { id: '1', lang: 'DE' };
      if (vm.idiom.language === 'EN') vm.selectedLang = { id: '2', lang: 'EN' };
      if (vm.idiom.language === 'ES') vm.selectedLang = { id: '3', lang: 'ES' };
      if (vm.idiom.language === 'IT') vm.selectedLang = { id: '4', lang: 'IT' };
    }

    // 
    vm.savedData = {};
    vm.savedData.idiom = vm.idiom.idiom;
    vm.savedData.meaning = vm.idiom.meaning;
    vm.savedData.derivation = vm.idiom.derivation;
    vm.savedData.approved = vm.idiom.approved;
    vm.savedData.selectedLang = vm.selectedLang.lang;

    vm.isDirty = false;
    vm.isCancelled = false;

    vm.checkDirty = function () {
      vm.isDirty = false;

      if (vm.savedData.idiom !== vm.idiom.idiom) {
        vm.isDirty = true;
        return;
      }
      if (vm.savedData.meaning !== vm.idiom.meaning) {
        vm.isDirty = true;
        return;
      }
      if (vm.savedData.derivation !== vm.idiom.derivation) {
        vm.isDirty = true;
        return;
      }
      if (vm.savedData.approved && vm.savedData.approved !== vm.idiom.approved) {
        vm.isDirty = true;
        return;
      }
      if (vm.savedData.selectedLang !== vm.selectedLang.lang) {
        vm.isDirty = true;
        return;
      }
      if (vm.uploader.queue.length > 0) {
        vm.isDirty = true;
        return;
      }
      if (vm.translation.translation) {
        vm.isDirty = true;
        return;
      }
      if (vm.equivalent.equiv_idiom) {
        vm.isDirty = true;
        return;
      }
    };

    // check dirty state and prevent go to other menu/page
    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      vm.checkDirty();
      if (vm.isDirty) {
        //Show alert and prevent state change
        event.preventDefault();
        vm.isCancelled = true;
        $scope.$apply();
        toastr.error('There are unsaved changes. Please saved your change or discard by click Cancel button.');
      }
    });

    vm.newIdiom = function () {
      if (vm.idiom.id) {
        $state.reload();
      }
      else {
        $state.go('idioms.create');
      }
    };

    vm.cancelClick = function () {
      vm.isCancelled = true;
      $scope.apply();
    };

    // custom dialog for New Idiom button
    vm.customDialogButtonsNewIdiom = {
      discard: {
        label: 'Discard changes',
        className: 'btn-danger',
        callback: function() {
          console.log('Discard changes action');
          if (!vm.idiom.id) {
            $state.reload();
          }
          else {
            $state.go('idioms.create');
          }
        }
      },
      cancel: {
        label: 'Cancel',
        className: 'btn-primary',
        callback: function() {
          vm.isCancelled = true;
          $scope.$apply();
        }
      }
    };

    // custom dialog for Cancel button
    vm.customDialogButtonsCancel = {
      discard: {
        label: 'Discard changes',
        className: 'btn-danger',
        callback: function() {
          console.log('Discard changes action');
          $state.go('home');
        }
      },
      cancel: {
        label: 'Cancel',
        className: 'btn-primary',
        callback: function() {
          vm.isCancelled = true;
          $scope.$apply();
        }
      }
    };

    // Remove existing Idiom
    function remove() {
      vm.idiom.$remove($state.go('idioms.create'));
      toastr.success('Idiom has been deleted successfully');
    }

    $scope.remove = function() {
      remove();
    };

    // Save Idiom
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.idiomForm');
        return false;
      }

      vm.idiom.language = vm.selectedLang.lang;
      var operation = '';

      // TODO: move create/update logic to service
      if (vm.idiom.id) {
        operation = 'update';
        vm.idiom.$update(successCallback, errorCallback);
      } else {
        operation = 'add';
        vm.idiom.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (operation === 'add') {
          console.log('success add idiom with id: '+res.id);
          toastr.success('New idiom has been added successfully. Please continue to add image, 121 translation, and its equivalent.');
        } else {
          console.log('success update idiom id: '+res.id);
          toastr.success('Idiom has been updated successfully.');
        }

        // save state
        vm.savedData.idiom = vm.idiom.idiom;
        vm.savedData.meaning = vm.idiom.meaning;
        vm.savedData.derivation = vm.idiom.derivation;
        vm.savedData.approved = vm.idiom.approved;
        vm.savedData.selectedLang = vm.selectedLang.lang;

        vm.isDirty = false;
        vm.isCancelled = false;
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        toastr.error(res.data.message, 'There is an error');
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
        vm.isDirty = true;
      }
    };

    // Called after the user has successfully uploaded a new picture
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      vm.success = true;

      // Clear upload buttons
      vm.uploader.clearQueue();
      toastr.success('Idiom picture changed successfully');
      vm.isDirty = false;
      vm.isCancelled = false;
    };

    // Called after the user has failed to uploaded a new picture
    vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      vm.cancelUpload();

      // Show error message
      vm.error = response.message;
      toastr.error(response.message, 'There is an error');
      vm.isDirty = false;
      vm.isCancelled = false;
    };

    // Change idiom picture
    vm.uploadPicture = function () {
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

      if (!vm.idiom.imageURL) {
        vm.imageURL = 'modules/idioms/client/img/no-image.png';
      } else {
        vm.imageURL = vm.idiom.imageURL;
      }

      vm.isDirty = false;
      vm.isCancelled = false;
    };

    // --------End Image functions ------------


    // --------Start 121 Translations functions ------------

    // get all translation based on idiom id
    function getTranslation() {
      TranslationsByIdiomService.query({ idiomId : vm.idiom.id })
      .$promise.then(function (res) {
        vm.translationsByIdiom = res;
      }, function(res) {
        vm.errorTranslation = res.data.message;
      });
    }

    // Save 121 Translations
    function saveTranslation(isValid) {

      // check 121 translation blank or not
      if (!vm.translation.translation) {
        vm.translationRequired = true;
        return false;
      }

      vm.translation.language = vm.selectedTranslationLang.lang;
      vm.translation.idiomId = vm.idiom.id;

      vm.translation.$save(successCallback, errorCallback);

      function successCallback(res) {
        console.log('success add 121 translation with id: '+res.id);

        //clear id and prepare for new translation
        vm.translation.id = '';
        vm.translation.translation = '';
        vm.selectedTranslationLang = { id: '2', lang: 'EN' };
        vm.translationRequired = false;

        // refresh translation list
        getTranslation();
      }

      function errorCallback(res) {
        vm.errorTranslation = res.data.message;
      }
    }

    // Delete 121 Translations
    function removeTranslation(translationId) {

      TranslationsService.delete({ translationId : translationId })
      .$promise.then(function (res) {
        console.log('success delete 121 Translations');

        // refresh translation list
        getTranslation();
      }, function(res) {
        console.log('error delete 121 Translations');
        vm.errorTranslation = res.data.message;
      });
    }

    $scope.removeTranslation = function(translationId) {
      removeTranslation(translationId);
    };

    // --------End 121 Translations functions ------------


    // --------Start Equivalent Translations functions ------------

    // get all equivalent translation based on idiom id
    function getEquivalent() {
      EquivalentsByIdiomService.query({ idiomId : vm.idiom.id })
      .$promise.then(function (res) {
        vm.equivalentsByIdiom = res;
      }, function(res) {
        vm.errorEquivalent = res.data.message;
      });
    }

    // Save Equivalent Translations
    function saveEquivalent(isValid) {

      // check Equivalent translation blank or not
      if (!vm.equivalent.equiv_idiom) {
        vm.equivalentRequired = true;
        return false;
      }

      vm.equivalent.language = vm.selectedEquivalentLang.lang;
      vm.equivalent.idiomId = vm.idiom.id;

      vm.equivalent.$save(successCallback, errorCallback);

      function successCallback(res) {
        console.log('success add equivalent translation with id: ' + res.id);

        //clear id and prepare for new equivalent translation
        vm.equivalent.id = '';
        vm.equivalent.equiv_idiom = '';
        vm.selectedEquivalentLang = { id: '2', lang: 'EN' };
        vm.equivalentRequired = false;
        vm.errorEquivalent = null;

        // refresh equivalent translation list
        getEquivalent();
      }

      function errorCallback(res) {
        vm.errorEquivalent = res.data.message;
      }
    }

    // Delete Equivalent Translations
    function removeEquivalent(equivalentId) {

      EquivalentsService.delete({ equivalentId : equivalentId })
      .$promise.then(function (res) {
        console.log('success delete equivalent Translations');

        // refresh equivalent translation list
        getEquivalent();
      }, function(res) {
        console.log('error delete equivalent Translations');
        vm.errorEquivalent = res.data.message;
      });
    }

    $scope.removeEquivalent = function(equivalentId) {
      removeEquivalent(equivalentId);
    };

    // --------End EquivalentId Translations functions ------------

  }
})();