(function () {
  'use strict';

  angular
    .module('races')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'characterOptions', {
      title: 'Races',
      state: 'races.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Race',
      state: 'races.create',
      roles: ['admin']
    });
  }
}());
