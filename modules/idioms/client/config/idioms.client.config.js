(function() {
  'use strict';

  angular
    .module('idioms')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Idioms',
      state: 'idioms',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'idioms', {
      title: 'List Idioms',
      state: 'idioms.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'idioms', {
      title: 'Create Idiom',
      state: 'idioms.create',
      roles: ['user', 'admin']
    });
  }
})();