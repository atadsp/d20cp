(function () {
  'use strict';

  angular
    .module('rulebooks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'gameInfo', {
      title: 'Rulebooks',
      state: 'rulebooks.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Rulebook',
      state: 'rulebooks.create',
      roles: ['admin']
    });
  }
}());
