(function () {
  'use strict';

  angular
    .module('psionics')
    .controller('PsionicsListController', PsionicsListController);

  PsionicsListController.$inject = ['PsionicsService'];

  function PsionicsListController(PsionicsService) {
    var vm = this;

    vm.psionics = PsionicsService.query();
  }
}());
