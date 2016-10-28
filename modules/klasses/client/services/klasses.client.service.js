// Klasses service used to communicate Klasses REST endpoints
(function () {
  'use strict';

  angular
    .module('klasses')
    .factory('KlassesService', KlassesService);

  KlassesService.$inject = ['$resource'];

  function KlassesService($resource) {
    return $resource('api/klasses/:klassId', {
      klassId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
