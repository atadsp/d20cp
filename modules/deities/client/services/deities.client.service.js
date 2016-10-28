// Deities service used to communicate Deities REST endpoints
(function () {
  'use strict';

  angular
    .module('deities')
    .factory('DeitiesService', DeitiesService);

  DeitiesService.$inject = ['$resource'];

  function DeitiesService($resource) {
    return $resource('api/deities/:deityId', {
      deityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
