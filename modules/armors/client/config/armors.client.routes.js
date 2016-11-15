(function () {
  'use strict';

  angular
    .module('armors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('armors', {
        abstract: true,
        url: '/armors',
        template: '<ui-view/>'
      })
      .state('armors.list', {
        url: '',
        templateUrl: 'modules/armors/client/views/list-armors.client.view.html',
        controller: 'ArmorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Armors List'
        }
      })
      .state('armors.create', {
        url: '/create',
        templateUrl: 'modules/armors/client/views/form-armor.client.view.html',
        controller: 'ArmorsController',
        controllerAs: 'vm',
        resolve: {
          armorResolve: newArmor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Armors Create'
        }
      })
      .state('armors.edit', {
        url: '/:armorId/edit',
        templateUrl: 'modules/armors/client/views/form-armor.client.view.html',
        controller: 'ArmorsController',
        controllerAs: 'vm',
        resolve: {
          armorResolve: getArmor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Armor {{ armorResolve.name }}'
        }
      })
      .state('armors.view', {
        url: '/:armorId',
        templateUrl: 'modules/armors/client/views/view-armor.client.view.html',
        controller: 'ArmorsController',
        controllerAs: 'vm',
        resolve: {
          armorResolve: getArmor
        },
        data: {
          pageTitle: 'Armor {{ armorResolve.name }}'
        }
      });
  }

  getArmor.$inject = ['$stateParams', 'ArmorsService'];

  function getArmor($stateParams, ArmorsService) {
    return ArmorsService.get({
      armorId: $stateParams.armorId
    }).$promise;
  }

  newArmor.$inject = ['ArmorsService'];

  function newArmor(ArmorsService) {
    return new ArmorsService();
  }
}());
