(function () {
  'use strict';

  angular
    .module('archetypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('archetypes', {
        abstract: true,
        url: '/archetypes',
        template: '<ui-view/>'
      })
      .state('archetypes.list', {
        url: '',
        templateUrl: 'modules/archetypes/client/views/list-archetypes.client.view.html',
        controller: 'ArchetypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Archetypes List'
        }
      })
      .state('archetypes.create', {
        url: '/create',
        templateUrl: 'modules/archetypes/client/views/form-archetype.client.view.html',
        controller: 'ArchetypesController',
        controllerAs: 'vm',
        resolve: {
          archetypeResolve: newArchetype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Archetypes Create'
        }
      })
      .state('archetypes.edit', {
        url: '/:archetypeId/edit',
        templateUrl: 'modules/archetypes/client/views/form-archetype.client.view.html',
        controller: 'ArchetypesController',
        controllerAs: 'vm',
        resolve: {
          archetypeResolve: getArchetype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Archetype {{ archetypeResolve.name }}'
        }
      })
      .state('archetypes.view', {
        url: '/:archetypeId',
        templateUrl: 'modules/archetypes/client/views/view-archetype.client.view.html',
        controller: 'ArchetypesController',
        controllerAs: 'vm',
        resolve: {
          archetypeResolve: getArchetype
        },
        data: {
          pageTitle: 'Archetype {{ archetypeResolve.name }}'
        }
      });
  }

  getArchetype.$inject = ['$stateParams', 'ArchetypesService'];

  function getArchetype($stateParams, ArchetypesService) {
    return ArchetypesService.get({
      archetypeId: $stateParams.archetypeId
    }).$promise;
  }

  newArchetype.$inject = ['ArchetypesService'];

  function newArchetype(ArchetypesService) {
    return new ArchetypesService();
  }
}());
