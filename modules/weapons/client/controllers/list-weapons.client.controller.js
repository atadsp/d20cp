(function () {
  'use strict';

  angular
    .module('weapons')
    .controller('WeaponsListController', WeaponsListController);

  WeaponsListController.$inject = ['WeaponsService'];

  function WeaponsListController(WeaponsService) {
    var vm = this;

    vm.weapons = WeaponsService.query();
  }
}());
