(function () {
  'use strict';

  angular
    .module('psionics')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('psionics', {
        abstract: true,
        url: '/psionics',
        template: '<ui-view/>'
      })
      .state('psionics.list', {
        url: '',
        templateUrl: 'modules/psionics/client/views/list-psionics.client.view.html',
        controller: 'PsionicsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Psionics List'
        }
      })
      .state('psionics.create', {
        url: '/create',
        templateUrl: 'modules/psionics/client/views/form-psionic.client.view.html',
        controller: 'PsionicsController',
        controllerAs: 'vm',
        resolve: {
          psionicResolve: newPsionic
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Psionics Create'
        }
      })
      .state('psionics.edit', {
        url: '/:psionicId/edit',
        templateUrl: 'modules/psionics/client/views/form-psionic.client.view.html',
        controller: 'PsionicsController',
        controllerAs: 'vm',
        resolve: {
          psionicResolve: getPsionic
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Psionic {{ psionicResolve.name }}'
        }
      })
      .state('psionics.view', {
        url: '/:psionicId',
        templateUrl: 'modules/psionics/client/views/view-psionic.client.view.html',
        controller: 'PsionicsController',
        controllerAs: 'vm',
        resolve: {
          psionicResolve: getPsionic
        },
        data: {
          pageTitle: 'Psionic {{ psionicResolve.name }}'
        }
      });
  }

  getPsionic.$inject = ['$stateParams', 'PsionicsService'];

  function getPsionic($stateParams, PsionicsService) {
    return PsionicsService.get({
      psionicId: $stateParams.psionicId
    }).$promise;
  }

  newPsionic.$inject = ['PsionicsService'];

  function newPsionic(PsionicsService) {
    return new PsionicsService();
  }
}());
