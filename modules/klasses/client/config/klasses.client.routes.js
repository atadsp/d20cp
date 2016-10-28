(function () {
  'use strict';

  angular
    .module('klasses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('klasses', {
        abstract: true,
        url: '/classes',
        template: '<ui-view/>'
      })
      .state('klasses.list', {
        url: '',
        templateUrl: 'modules/klasses/client/views/list-klasses.client.view.html',
        controller: 'KlassesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Class List'
        }
      })
      .state('klasses.create', {
        url: '/create',
        templateUrl: 'modules/klasses/client/views/form-klass.client.view.html',
        controller: 'KlassesController',
        controllerAs: 'vm',
        resolve: {
          klassResolve: newKlass
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Class Create'
        }
      })
      .state('klasses.edit', {
        url: '/:klassId/edit',
        templateUrl: 'modules/klasses/client/views/form-klass.client.view.html',
        controller: 'KlassesController',
        controllerAs: 'vm',
        resolve: {
          klassResolve: getKlass
        },
        data: {
          roles: [ 'admin'],
          pageTitle: 'Edit Class {{ klassResolve.name }}'
        }
      })
      .state('klasses.view', {
        url: '/:klassId',
        templateUrl: 'modules/klasses/client/views/view-klass.client.view.html',
        controller: 'KlassesController',
        controllerAs: 'vm',
        resolve: {
          klassResolve: getKlass
        },
        data: {
          pageTitle: 'Class {{ klassResolve.name }}'
        }
      });
  }

  getKlass.$inject = ['$stateParams', 'KlassesService'];

  function getKlass($stateParams, KlassesService) {
    return KlassesService.get({
      klassId: $stateParams.klassId
    }).$promise;
  }

  newKlass.$inject = ['KlassesService'];

  function newKlass(KlassesService) {
    return new KlassesService();
  }
}());
