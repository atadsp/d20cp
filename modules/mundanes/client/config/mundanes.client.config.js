(function () {
  'use strict';

  angular
    .module('mundanes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'items', {
      title: 'Mundane Items',
      state: 'mundanes.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Mundane Item',
      state: 'mundanes.create',
      roles: ['admin']
    });
  }
}());
