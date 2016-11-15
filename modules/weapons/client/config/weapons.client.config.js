(function () {
  'use strict';

  angular
    .module('weapons')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'items', {
      title: 'Weapons',
      state: 'weapons.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Weapon',
      state: 'weapons.create',
      roles: ['admin']
    });
  }
}());
