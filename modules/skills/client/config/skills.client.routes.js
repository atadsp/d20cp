(function () {
  'use strict';

  angular
    .module('skills')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('skills', {
        abstract: true,
        url: '/skills',
        template: '<ui-view/>'
      })
      .state('skills.list', {
        url: '',
        templateUrl: 'modules/skills/client/views/list-skills.client.view.html',
        controller: 'SkillsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Skills List'
        }
      })
      .state('skills.create', {
        url: '/create',
        templateUrl: 'modules/skills/client/views/form-skill.client.view.html',
        controller: 'SkillsController',
        controllerAs: 'vm',
        resolve: {
          skillResolve: newSkill
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Skills Create'
        }
      })
      .state('skills.edit', {
        url: '/:skillId/edit',
        templateUrl: 'modules/skills/client/views/form-skill.client.view.html',
        controller: 'SkillsController',
        controllerAs: 'vm',
        resolve: {
          skillResolve: getSkill
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Skill {{ skillResolve.name }}'
        }
      })
      .state('skills.view', {
        url: '/:skillId',
        templateUrl: 'modules/skills/client/views/view-skill.client.view.html',
        controller: 'SkillsController',
        controllerAs: 'vm',
        resolve: {
          skillResolve: getSkill
        },
        data: {
          pageTitle: 'Skill {{ skillResolve.name }}'
        }
      });
  }

  getSkill.$inject = ['$stateParams', 'SkillsService'];

  function getSkill($stateParams, SkillsService) {
    return SkillsService.get({
      skillId: $stateParams.skillId
    }).$promise;
  }

  newSkill.$inject = ['SkillsService'];

  function newSkill(SkillsService) {
    return new SkillsService();
  }
}());
