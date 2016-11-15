(function () {
  'use strict';

  angular
    .module('archetypes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
    Menus.addMenuItem('topbar', {
      title: 'Character Options',
      state: 'characterOptions',
      type: 'dropdown',
      roles: ['*']
    });
    Menus.addMenuItem('topbar', {
      title: 'Game Information',
      state: 'gameInfo',
      type: 'dropdown',
      roles: ['*']
    });
    Menus.addMenuItem('topbar', {
      title: 'Items',
      state: 'items',
      type: 'dropdown',
      roles: ['*']
    });
    Menus.addMenuItem('topbar', {
      title: 'Magic',
      state: 'magic',
      type: 'dropdown',
      roles: ['*']
    });
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'characterOptions', {
      title: 'Archetypes',
      state: 'archetypes.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Archetype',
      state: 'archetypes.create',
      roles: ['admin']
    });
  }
}());
