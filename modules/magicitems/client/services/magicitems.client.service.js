// Magicitems service used to communicate Magicitems REST endpoints
(function () {
  'use strict';

  angular
    .module('magicitems')
    .factory('MagicitemsService', MagicitemsService);

  MagicitemsService.$inject = ['$resource'];

  function MagicitemsService($resource) {
    return $resource('api/magicitems/:magicitemId', {
      magicitemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
