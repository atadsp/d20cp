(function () {
  'use strict';

  angular
    .module('languages')
    .controller('LanguagesListController', LanguagesListController);

  LanguagesListController.$inject = ['LanguagesService'];

  function LanguagesListController(LanguagesService) {
    var vm = this;

    vm.languages = LanguagesService.query();
  }
}());
