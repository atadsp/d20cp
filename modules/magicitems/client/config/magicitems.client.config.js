(function () {
  'use strict';

  angular
    .module('magicitems')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'items', {
      title: 'Magic Items',
      state: 'magicitems.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Magic Item',
      state: 'magicitems.create',
      roles: ['admin']
    });
  }
}());
