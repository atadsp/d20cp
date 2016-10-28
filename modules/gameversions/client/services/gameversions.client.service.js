// Gameversions service used to communicate Gameversions REST endpoints
(function () {
  'use strict';

  angular
    .module('gameversions')
    .factory('GameversionsService', GameversionsService);

  GameversionsService.$inject = ['$resource'];

  function GameversionsService($resource) {
    return $resource('api/gameversions/:gameversionId', {
      gameversionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
