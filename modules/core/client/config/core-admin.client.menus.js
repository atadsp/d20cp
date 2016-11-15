'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    //currently loaded through whichever module comes first alphabeticlly
    // Menus.addMenuItem('topbar', {
    //   title: 'Admin',
    //   state: 'admin',
    //   type: 'dropdown',
    //   roles: ['admin']
    // });
    // Menus.addMenuItem('topbar', {
    //   title: 'Character Options',
    //   state: 'characterOptions',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
    // Menus.addMenuItem('topbar', {
    //   title: 'Game Information',
    //   state: 'gameInfo',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
    // Menus.addMenuItem('topbar', {
    //   title: 'Items',
    //   state: 'items',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
    // Menus.addMenuItem('topbar', {
    //   title: 'Magic',
    //   state: 'magic',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
  }
]);
