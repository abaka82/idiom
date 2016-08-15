(function() {
  'use strict';

  angular
    .module('idioms')
    .controller('IdiomsController', IdiomsController);

  IdiomsController.$inject = ['$http', '$scope', '$timeout', '$window', '$state', 'idiomResolve', 'Authentication', 'FileUploader'];

  function IdiomsController($http, $scope, $timeout, $window, $state, idiom, Authentication, FileUploader) {
    var vm = this;

    vm.idiom = idiom;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.languages = [
      { id: '1', lang: 'DE' },
      { id: '2', lang: 'EN' },
      { id: '3', lang: 'ES' },
      { id: '4', lang: 'IT' }];
    vm.selectedLang = { id: '1', lang: 'DE' }; //This sets the default value of the select in the ui

    // Remove existing Idiom
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.idiom.$remove($state.go('idioms.list'));
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
        /*$state.go('idioms.view', {
          idiomId: res.id
        });*/
        console.log('successsssss');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }
  }
})();