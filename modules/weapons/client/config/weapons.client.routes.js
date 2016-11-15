(function () {
  'use strict';

  angular
    .module('weapons')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('weapons', {
        abstract: true,
        url: '/weapons',
        template: '<ui-view/>'
      })
      .state('weapons.list', {
        url: '',
        templateUrl: 'modules/weapons/client/views/list-weapons.client.view.html',
        controller: 'WeaponsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Weapons List'
        }
      })
      .state('weapons.create', {
        url: '/create',
        templateUrl: 'modules/weapons/client/views/form-weapon.client.view.html',
        controller: 'WeaponsController',
        controllerAs: 'vm',
        resolve: {
          weaponResolve: newWeapon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Weapons Create'
        }
      })
      .state('weapons.edit', {
        url: '/:weaponId/edit',
        templateUrl: 'modules/weapons/client/views/form-weapon.client.view.html',
        controller: 'WeaponsController',
        controllerAs: 'vm',
        resolve: {
          weaponResolve: getWeapon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Weapon {{ weaponResolve.name }}'
        }
      })
      .state('weapons.view', {
        url: '/:weaponId',
        templateUrl: 'modules/weapons/client/views/view-weapon.client.view.html',
        controller: 'WeaponsController',
        controllerAs: 'vm',
        resolve: {
          weaponResolve: getWeapon
        },
        data: {
          pageTitle: 'Weapon {{ weaponResolve.name }}'
        }
      });
  }

  getWeapon.$inject = ['$stateParams', 'WeaponsService'];

  function getWeapon($stateParams, WeaponsService) {
    return WeaponsService.get({
      weaponId: $stateParams.weaponId
    }).$promise;
  }

  newWeapon.$inject = ['WeaponsService'];

  function newWeapon(WeaponsService) {
    return new WeaponsService();
  }
}());
