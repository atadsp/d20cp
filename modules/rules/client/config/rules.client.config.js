(function () {
  'use strict';

  angular
    .module('rules')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'gameInfo', {
      title: 'Rules',
      state: 'rules.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Rule',
      state: 'rules.create',
      roles: ['admin']
    });
  }
}());
