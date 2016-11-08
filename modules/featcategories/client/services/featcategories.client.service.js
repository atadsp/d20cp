// Featcategories service used to communicate Featcategories REST endpoints
(function () {
  'use strict';

  angular
    .module('featcategories')
    .factory('FeatcategoriesService', FeatcategoriesService);

  FeatcategoriesService.$inject = ['$resource'];

  function FeatcategoriesService($resource) {
    return $resource('api/featcategories/:featcategoryId', {
      featcategoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
