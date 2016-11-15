(function () {
  'use strict';

  angular
    .module('magicitems')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('magicitems', {
        abstract: true,
        url: '/magicitems',
        template: '<ui-view/>'
      })
      .state('magicitems.list', {
        url: '',
        templateUrl: 'modules/magicitems/client/views/list-magicitems.client.view.html',
        controller: 'MagicitemsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Magicitems List'
        }
      })
      .state('magicitems.create', {
        url: '/create',
        templateUrl: 'modules/magicitems/client/views/form-magicitem.client.view.html',
        controller: 'MagicitemsController',
        controllerAs: 'vm',
        resolve: {
          magicitemResolve: newMagicitem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Magicitems Create'
        }
      })
      .state('magicitems.edit', {
        url: '/:magicitemId/edit',
        templateUrl: 'modules/magicitems/client/views/form-magicitem.client.view.html',
        controller: 'MagicitemsController',
        controllerAs: 'vm',
        resolve: {
          magicitemResolve: getMagicitem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Magicitem {{ magicitemResolve.name }}'
        }
      })
      .state('magicitems.view', {
        url: '/:magicitemId',
        templateUrl: 'modules/magicitems/client/views/view-magicitem.client.view.html',
        controller: 'MagicitemsController',
        controllerAs: 'vm',
        resolve: {
          magicitemResolve: getMagicitem
        },
        data: {
          pageTitle: 'Magicitem {{ magicitemResolve.name }}'
        }
      });
  }

  getMagicitem.$inject = ['$stateParams', 'MagicitemsService'];

  function getMagicitem($stateParams, MagicitemsService) {
    return MagicitemsService.get({
      magicitemId: $stateParams.magicitemId
    }).$promise;
  }

  newMagicitem.$inject = ['MagicitemsService'];

  function newMagicitem(MagicitemsService) {
    return new MagicitemsService();
  }
}());
