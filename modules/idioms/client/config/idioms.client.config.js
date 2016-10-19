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
      roles: ['guest', 'user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'idioms', {
      title: 'List Idioms',
      state: 'idioms.list',
      roles: ['guest', 'user', 'admin']
    });

    // Add the dropdown view item
    Menus.addSubMenuItem('topbar', 'idioms', {
      title: 'View Idioms',
      state: 'idioms.view',
      roles: ['guest', 'user', 'admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'idioms', {
      title: 'Create Idiom',
      state: 'idioms.create',
      roles: ['user', 'admin']
    });
  }
})();