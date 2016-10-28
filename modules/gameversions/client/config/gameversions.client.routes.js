(function () {
  'use strict';

  angular
    .module('gameversions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('gameversions', {
        abstract: true,
        url: '/gameversions',
        template: '<ui-view/>'
      })
      .state('gameversions.list', {
        url: '',
        templateUrl: 'modules/gameversions/client/views/list-gameversions.client.view.html',
        controller: 'GameversionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Game Versions List'
        }
      })
      .state('gameversions.create', {
        url: '/create',
        templateUrl: 'modules/gameversions/client/views/form-gameversion.client.view.html',
        controller: 'GameversionsController',
        controllerAs: 'vm',
        resolve: {
          gameversionResolve: newGameversion
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Game Versions Create'
        }
      })
      .state('gameversions.edit', {
        url: '/:gameversionId/edit',
        templateUrl: 'modules/gameversions/client/views/form-gameversion.client.view.html',
        controller: 'GameversionsController',
        controllerAs: 'vm',
        resolve: {
          gameversionResolve: getGameversion
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Game Version {{ gameversionResolve.name }}'
        }
      })
      .state('gameversions.view', {
        url: '/:gameversionId',
        templateUrl: 'modules/gameversions/client/views/view-gameversion.client.view.html',
        controller: 'GameversionsController',
        controllerAs: 'vm',
        resolve: {
          gameversionResolve: getGameversion
        },
        data: {
          pageTitle: 'Game Version {{ gameversionResolve.name }}'
        }
      });
  }

  getGameversion.$inject = ['$stateParams', 'GameversionsService'];

  function getGameversion($stateParams, GameversionsService) {
    return GameversionsService.get({
      gameversionId: $stateParams.gameversionId
    }).$promise;
  }

  newGameversion.$inject = ['GameversionsService'];

  function newGameversion(GameversionsService) {
    return new GameversionsService();
  }
}());
