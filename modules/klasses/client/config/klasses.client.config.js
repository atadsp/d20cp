(function () {
  'use strict';

  angular
    .module('klasses')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'characterOptions', {
      title: 'Classes',
      state: 'klasses.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Class',
      state: 'klasses.create',
      roles: ['admin']
    });
  }
}());
