// Skills service used to communicate Skills REST endpoints
(function () {
  'use strict';

  angular
    .module('skills')
    .factory('SkillsService', SkillsService);

  SkillsService.$inject = ['$resource'];

  function SkillsService($resource) {
    return $resource('api/skills/:skillId', {
      skillId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
