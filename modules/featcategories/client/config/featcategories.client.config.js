(function () {
  'use strict';

  angular
    .module('featcategories')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'List Feat Category',
      state: 'featcategories.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Feat Category',
      state: 'featcategories.create',
      roles: ['admin']
    });
  }
}());
