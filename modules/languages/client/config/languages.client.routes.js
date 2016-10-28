(function () {
  'use strict';

  angular
    .module('languages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('languages', {
        abstract: true,
        url: '/languages',
        template: '<ui-view/>'
      })
      .state('languages.list', {
        url: '',
        templateUrl: 'modules/languages/client/views/list-languages.client.view.html',
        controller: 'LanguagesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Languages List'
        }
      })
      .state('languages.create', {
        url: '/create',
        templateUrl: 'modules/languages/client/views/form-language.client.view.html',
        controller: 'LanguagesController',
        controllerAs: 'vm',
        resolve: {
          languageResolve: newLanguage
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Languages Create'
        }
      })
      .state('languages.edit', {
        url: '/:languageId/edit',
        templateUrl: 'modules/languages/client/views/form-language.client.view.html',
        controller: 'LanguagesController',
        controllerAs: 'vm',
        resolve: {
          languageResolve: getLanguage
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Language {{ languageResolve.name }}'
        }
      })
      .state('languages.view', {
        url: '/:languageId',
        templateUrl: 'modules/languages/client/views/view-language.client.view.html',
        controller: 'LanguagesController',
        controllerAs: 'vm',
        resolve: {
          languageResolve: getLanguage
        },
        data: {
          pageTitle: 'Language {{ languageResolve.name }}'
        }
      });
  }

  getLanguage.$inject = ['$stateParams', 'LanguagesService'];

  function getLanguage($stateParams, LanguagesService) {
    return LanguagesService.get({
      languageId: $stateParams.languageId
    }).$promise;
  }

  newLanguage.$inject = ['LanguagesService'];

  function newLanguage(LanguagesService) {
    return new LanguagesService();
  }
}());
