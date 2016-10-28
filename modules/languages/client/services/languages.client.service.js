// Languages service used to communicate Languages REST endpoints
(function () {
  'use strict';

  angular
    .module('languages')
    .factory('LanguagesService', LanguagesService);

  LanguagesService.$inject = ['$resource'];

  function LanguagesService($resource) {
    return $resource('api/languages/:languageId', {
      languageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
