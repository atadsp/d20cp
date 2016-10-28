(function () {
  'use strict';

  angular
    .module('deities')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Deities',
      state: 'deities.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Deity',
      state: 'deities.create',
      roles: ['admin']
    });
  }
}());
