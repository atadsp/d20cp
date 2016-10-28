(function () {
  'use strict';

  angular
    .module('feats')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Feats',
      state: 'feats.list',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Feats',
      state: 'feats.create',
      roles: ['admin']
    });
  }
}());
