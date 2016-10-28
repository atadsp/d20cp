(function () {
  'use strict';

  angular
    .module('deities')
    .controller('DeitiesListController', DeitiesListController);

  DeitiesListController.$inject = ['DeitiesService'];

  function DeitiesListController(DeitiesService) {
    var vm = this;

    vm.deities = DeitiesService.query();
  }
}());
