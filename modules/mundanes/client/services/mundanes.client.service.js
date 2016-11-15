// Mundanes service used to communicate Mundanes REST endpoints
(function () {
  'use strict';

  angular
    .module('mundanes')
    .factory('MundanesService', MundanesService);

  MundanesService.$inject = ['$resource'];

  function MundanesService($resource) {
    return $resource('api/mundanes/:mundaneId', {
      mundaneId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
