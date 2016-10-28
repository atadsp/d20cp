(function () {
  'use strict';

  angular
    .module('deities')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('deities', {
        abstract: true,
        url: '/deities',
        template: '<ui-view/>'
      })
      .state('deities.list', {
        url: '',
        templateUrl: 'modules/deities/client/views/list-deities.client.view.html',
        controller: 'DeitiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Deities List'
        }
      })
      .state('deities.create', {
        url: '/create',
        templateUrl: 'modules/deities/client/views/form-deity.client.view.html',
        controller: 'DeitiesController',
        controllerAs: 'vm',
        resolve: {
          deityResolve: newDeity
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Deities Create'
        }
      })
      .state('deities.edit', {
        url: '/:deityId/edit',
        templateUrl: 'modules/deities/client/views/form-deity.client.view.html',
        controller: 'DeitiesController',
        controllerAs: 'vm',
        resolve: {
          deityResolve: getDeity
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Deity {{ deityResolve.name }}'
        }
      })
      .state('deities.view', {
        url: '/:deityId',
        templateUrl: 'modules/deities/client/views/view-deity.client.view.html',
        controller: 'DeitiesController',
        controllerAs: 'vm',
        resolve: {
          deityResolve: getDeity
        },
        data: {
          pageTitle: 'Deity {{ deityResolve.name }}'
        }
      });
  }

  getDeity.$inject = ['$stateParams', 'DeitiesService'];

  function getDeity($stateParams, DeitiesService) {
    return DeitiesService.get({
      deityId: $stateParams.deityId
    }).$promise;
  }

  newDeity.$inject = ['DeitiesService'];

  function newDeity(DeitiesService) {
    return new DeitiesService();
  }
}());
