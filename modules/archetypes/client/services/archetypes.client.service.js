// Archetypes service used to communicate Archetypes REST endpoints
(function () {
  'use strict';

  angular
    .module('archetypes')
    .factory('ArchetypesService', ArchetypesService);

  ArchetypesService.$inject = ['$resource'];

  function ArchetypesService($resource) {
    return $resource('api/archetypes/:archetypeId', {
      archetypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
