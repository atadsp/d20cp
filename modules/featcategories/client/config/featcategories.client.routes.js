(function () {
  'use strict';

  angular
    .module('featcategories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('featcategories', {
        abstract: true,
        url: '/featcategories',
        template: '<ui-view/>'
      })
      .state('featcategories.list', {
        url: '',
        templateUrl: 'modules/featcategories/client/views/list-featcategories.client.view.html',
        controller: 'FeatcategoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Feat Categories List'
        }
      })
      .state('featcategories.create', {
        url: '/create',
        templateUrl: 'modules/featcategories/client/views/form-featcategory.client.view.html',
        controller: 'FeatcategoriesController',
        controllerAs: 'vm',
        resolve: {
          featcategoryResolve: newFeatcategory
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Feat Category Create'
        }
      })
      .state('featcategories.edit', {
        url: '/:featcategoryId/edit',
        templateUrl: 'modules/featcategories/client/views/form-featcategory.client.view.html',
        controller: 'FeatcategoriesController',
        controllerAs: 'vm',
        resolve: {
          featcategoryResolve: getFeatcategory
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Feat Category {{ featcategoryResolve.name }}'
        }
      })
      .state('featcategories.view', {
        url: '/:featcategoryId',
        templateUrl: 'modules/featcategories/client/views/view-featcategory.client.view.html',
        controller: 'FeatcategoriesController',
        controllerAs: 'vm',
        resolve: {
          featcategoryResolve: getFeatcategory
        },
        data: {
          pageTitle: 'Featcategory {{ featcategoryResolve.name }}'
        }
      });
  }

  getFeatcategory.$inject = ['$stateParams', 'FeatcategoriesService'];

  function getFeatcategory($stateParams, FeatcategoriesService) {
    return FeatcategoriesService.get({
      featcategoryId: $stateParams.featcategoryId
    }).$promise;
  }

  newFeatcategory.$inject = ['FeatcategoriesService'];

  function newFeatcategory(FeatcategoriesService) {
    return new FeatcategoriesService();
  }
}());
