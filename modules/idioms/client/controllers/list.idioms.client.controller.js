  'use strict';

  angular
  .module('idioms')
  .controller('IdiomsListController', function ($scope, $filter, $state, IdiomsService, NgTableParams) {
    var vm = this;

    var orderBy = $filter('orderBy');
    vm.searchKeyword = { idiom: '', derivation: '' };

    function remove(id) {
      IdiomsService.delete({ idiomId : id })
      .$promise.then(function (res) {
        console.log('success delete idiom id: '+ id);
        $state.reload();
      }, function(res) {
        console.log('error delete idiom id: '+ id);
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

          if (params.filter().idiom || params.filter().derivation) {
            vm.data = $filter('filter')(vm.idioms, params.filter());
            console.log('==params.filter()======='+JSON.stringify(params.filter()));
            console.log('==vm.searchKeyword======='+JSON.stringify(vm.searchKeyword));
            console.log('==vm.data filter========'+JSON.stringify(vm.data));
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

