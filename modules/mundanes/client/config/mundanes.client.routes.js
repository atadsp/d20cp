(function () {
  'use strict';

  angular
    .module('mundanes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mundanes', {
        abstract: true,
        url: '/mundanes',
        template: '<ui-view/>'
      })
      .state('mundanes.list', {
        url: '',
        templateUrl: 'modules/mundanes/client/views/list-mundanes.client.view.html',
        controller: 'MundanesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mundanes List'
        }
      })
      .state('mundanes.create', {
        url: '/create',
        templateUrl: 'modules/mundanes/client/views/form-mundane.client.view.html',
        controller: 'MundanesController',
        controllerAs: 'vm',
        resolve: {
          mundaneResolve: newMundane
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mundanes Create'
        }
      })
      .state('mundanes.edit', {
        url: '/:mundaneId/edit',
        templateUrl: 'modules/mundanes/client/views/form-mundane.client.view.html',
        controller: 'MundanesController',
        controllerAs: 'vm',
        resolve: {
          mundaneResolve: getMundane
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Mundane {{ mundaneResolve.name }}'
        }
      })
      .state('mundanes.view', {
        url: '/:mundaneId',
        templateUrl: 'modules/mundanes/client/views/view-mundane.client.view.html',
        controller: 'MundanesController',
        controllerAs: 'vm',
        resolve: {
          mundaneResolve: getMundane
        },
        data: {
          pageTitle: 'Mundane {{ mundaneResolve.name }}'
        }
      });
  }

  getMundane.$inject = ['$stateParams', 'MundanesService'];

  function getMundane($stateParams, MundanesService) {
    return MundanesService.get({
      mundaneId: $stateParams.mundaneId
    }).$promise;
  }

  newMundane.$inject = ['MundanesService'];

  function newMundane(MundanesService) {
    return new MundanesService();
  }
}());
