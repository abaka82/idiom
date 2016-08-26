  'use strict';

  angular
  .module('idioms')
  .controller('IdiomsListController', function ($scope, $filter, IdiomsService, NgTableParams) {
    var vm = this;
/*
     vm.searchKeyword = { Title: '', Author: '', Category:'', Stock:'' };

          vm.order = function(predicate) {
            vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
            vm.predicate = predicate;
          };*/

    var orderBy = $filter('orderBy');
    vm.listIdiomTable = new NgTableParams({
      page: 1,
      count: 10000000000,
      filter: vm.searchKeyword
    }, {
      total: 0, // length of data
      // page size buttons (right set of buttons in demo)
      counts: [],
      // determines the pager buttons (left set of buttons in demo)
      paginationMaxBlocks: 13,
      paginationMinBlocks: 2,
      getData: function (params) {
        IdiomsService.query({}, function(response) {
          vm.products = response;
          console.log('==vm.products========'+JSON.stringify(vm.products));
          //$scope.data = $scope.products.slice((params.page() - 1) * params.count(), params.page() * params.count());
          //if (params.filter().Title || params.filter().Author || params.filter().Category || params.filter().Stock  ) {
          vm.data = $filter('filter')(vm.products, params.filter());
          params.total(vm.data.length); 
          // } else {
          vm.data = vm.products.slice((params.page() - 1) * params.count(), params.page() * params.count());
          params.total(vm.products.length); 
          // }

          // set total for recalc pagination
          //$defer.resolve(vm.data;);
          console.log('==vm.data========'+JSON.stringify(vm.data));
          return vm.data;
        });
      }
    });
  });

