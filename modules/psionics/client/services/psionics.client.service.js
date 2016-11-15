// Psionics service used to communicate Psionics REST endpoints
(function () {
  'use strict';

  angular
    .module('psionics')
    .factory('PsionicsService', PsionicsService);

  PsionicsService.$inject = ['$resource'];

  function PsionicsService($resource) {
    return $resource('api/psionics/:psionicId', {
      psionicId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
