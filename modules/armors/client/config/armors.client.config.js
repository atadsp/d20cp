(function () {
  'use strict';

  angular
    .module('armors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'items', {
      title: 'Armors',
      state: 'armors.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Armor',
      state: 'armors.create',
      roles: ['admin']
    });
  }
}());
