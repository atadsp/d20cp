(function () {
  'use strict';

  angular
    .module('mundanes')
    .controller('MundanesListController', MundanesListController);

  MundanesListController.$inject = ['MundanesService'];

  function MundanesListController(MundanesService) {
    var vm = this;

    vm.mundanes = MundanesService.query();
  }
}());
