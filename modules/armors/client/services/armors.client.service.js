// Armors service used to communicate Armors REST endpoints
(function () {
  'use strict';

  angular
    .module('armors')
    .factory('ArmorsService', ArmorsService);

  ArmorsService.$inject = ['$resource'];

  function ArmorsService($resource) {
    return $resource('api/armors/:armorId', {
      armorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
