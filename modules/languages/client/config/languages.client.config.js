(function () {
  'use strict';

  angular
    .module('languages')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'characterOptions', {
      title: 'Languages',
      state: 'languages.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Language',
      state: 'languages.create',
      roles: ['admin']
    });
  }
}());
