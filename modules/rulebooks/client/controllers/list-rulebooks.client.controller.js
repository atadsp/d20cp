(function () {
  'use strict';

  angular
    .module('rulebooks')
    .controller('RulebooksListController', RulebooksListController);

  RulebooksListController.$inject = ['RulebooksService'];

  function RulebooksListController(RulebooksService) {
    var vm = this;

    vm.rulebooks = RulebooksService.query();
  }
}());
