(function () {
  'use strict';

  angular
    .module('rulebooks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rulebooks', {
        abstract: true,
        url: '/rulebooks',
        template: '<ui-view/>'
      })
      .state('rulebooks.list', {
        url: '',
        templateUrl: 'modules/rulebooks/client/views/list-rulebooks.client.view.html',
        controller: 'RulebooksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Rulebooks List'
        }
      })
      .state('rulebooks.create', {
        url: '/create',
        templateUrl: 'modules/rulebooks/client/views/form-rulebook.client.view.html',
        controller: 'RulebooksController',
        controllerAs: 'vm',
        resolve: {
          rulebookResolve: newRulebook
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Rulebooks Create'
        }
      })
      .state('rulebooks.edit', {
        url: '/:rulebookId/edit',
        templateUrl: 'modules/rulebooks/client/views/form-rulebook.client.view.html',
        controller: 'RulebooksController',
        controllerAs: 'vm',
        resolve: {
          rulebookResolve: getRulebook
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Rulebook {{ rulebookResolve.name }}'
        }
      })
      .state('rulebooks.view', {
        url: '/:rulebookId',
        templateUrl: 'modules/rulebooks/client/views/view-rulebook.client.view.html',
        controller: 'RulebooksController',
        controllerAs: 'vm',
        resolve: {
          rulebookResolve: getRulebook
        },
        data: {
          pageTitle: 'Rulebook {{ rulebookResolve.name }}'
        }
      });
  }

  getRulebook.$inject = ['$stateParams', 'RulebooksService'];

  function getRulebook($stateParams, RulebooksService) {
    return RulebooksService.get({
      rulebookId: $stateParams.rulebookId
    }).$promise;
  }

  newRulebook.$inject = ['RulebooksService'];

  function newRulebook(RulebooksService) {
    return new RulebooksService();
  }
}());
