  'use strict';

  angular
  .module('idioms')
  .controller('IdiomsListController', function ($scope, $filter, $state, toastr, IdiomsService, NgTableParams) {
    var vm = this;

    var orderBy = $filter('orderBy');
    vm.searchKeyword = { idiom: '', language: '' };

    vm.languages = [
      { id: '1', lang: 'DE' },
      { id: '2', lang: 'EN' },
      { id: '3', lang: 'ES' },
      { id: '4', lang: 'IT' },
      { id: '5', lang: '' }];

    //Set default value of combobox in the ui
    vm.selectedLang = { id: '5', lang: '' };

    vm.changeLang = function() {
      vm.searchKeyword.language = vm.selectedLang.lang;
    };

    function remove(id) {
      IdiomsService.delete({ idiomId : id })
      .$promise.then(function (res) {
        console.log('success delete idiom id: '+ id);
        toastr.success('Idiom has been deleted successfully');
        $state.reload();
      }, function(res) {
        console.log('error delete idiom id: '+ id);
        toastr.error(res.data.message, 'There is an error');
        vm.errorTranslation = res.data.message;
      });
    }

    $scope.remove = function(id) {
      remove(id);
    };

    vm.order = function(predicate) {
      vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
      vm.predicate = predicate;
    };


    vm.listIdiomTable = new NgTableParams({
      page: 1,
      count: 10,  //items per page
      filter: vm.searchKeyword
    }, {
      total: 0, // length of data
      getData: function ($defer, params) {
        IdiomsService.query({}, function(response) {
          vm.idioms = response;

          if (params.filter().idiom || params.filter().language) {
            vm.data = $filter('filter')(vm.idioms, params.filter());
            console.log('==params.filter()======='+JSON.stringify(params.filter()));
            params.total(vm.data.length); 
          } else {
            vm.data = vm.idioms.slice((params.page() - 1) * params.count(), params.page() * params.count());
            params.total(vm.idioms.length); 
          }

          // set total for recalc pagination
          $defer.resolve(vm.data);
        });
      }
    });
  });

