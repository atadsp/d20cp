(function () {
  'use strict';

  angular
    .module('news')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'news.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Article',
      state: 'news.create',
      roles: ['admin']
    });
  }
}());
