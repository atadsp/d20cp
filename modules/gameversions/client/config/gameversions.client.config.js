(function () {
  'use strict';

  angular
    .module('gameversions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Game Versions',
      state: 'gameversions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Game Version',
      state: 'gameversions.create',
      roles: ['admin']
    });
  }
}());
