(function () {
  'use strict';

  angular
    .module('armors')
    .controller('ArmorsListController', ArmorsListController);

  ArmorsListController.$inject = ['ArmorsService'];

  function ArmorsListController(ArmorsService) {
    var vm = this;

    vm.armors = ArmorsService.query();
  }
}());
