// Weapons service used to communicate Weapons REST endpoints
(function () {
  'use strict';

  angular
    .module('weapons')
    .factory('WeaponsService', WeaponsService);

  WeaponsService.$inject = ['$resource'];

  function WeaponsService($resource) {
    return $resource('api/weapons/:weaponId', {
      weaponId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
