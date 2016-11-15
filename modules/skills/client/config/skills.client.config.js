(function () {
  'use strict';

  angular
    .module('skills')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'characterOptions', {
      title: 'Skills',
      state: 'skills.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Skill',
      state: 'skills.create',
      roles: ['admin']
    });
  }
}());
