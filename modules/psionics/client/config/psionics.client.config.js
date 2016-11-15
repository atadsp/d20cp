(function () {
  'use strict';

  angular
    .module('psionics')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'magic', {
      title: 'Psionics',
      state: 'psionics.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Psionic',
      state: 'psionics.create',
      roles: ['admin']
    });
  }
}());
