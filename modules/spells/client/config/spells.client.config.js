(function () {
  'use strict';

  angular
    .module('spells')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Spells',
      state: 'spells.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Spell',
      state: 'spells.create',
      roles: ['admin']
    });
  }
}());
