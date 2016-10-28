// Rulebooks service used to communicate Rulebooks REST endpoints
(function () {
  'use strict';

  angular
    .module('rulebooks')
    .factory('RulebooksService', RulebooksService);

  RulebooksService.$inject = ['$resource'];

  function RulebooksService($resource) {
    return $resource('api/rulebooks/:rulebookId', {
      rulebookId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
