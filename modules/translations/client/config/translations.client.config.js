(function() {
  'use strict';

  angular
    .module('translations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Translations',
      state: 'translations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'translations', {
      title: 'List Translations',
      state: 'translations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'translations', {
      title: 'Create Translation',
      state: 'translations.create',
      roles: ['user', 'admin']
    });
  }
})();