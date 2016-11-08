(function () {
  'use strict';

  angular
    .module('klasses')
    .controller('KlassesListController', KlassesListController);

  KlassesListController.$inject = ['KlassesService'];

  function KlassesListController(KlassesService) {
    var vm = this;

    vm.klasses = KlassesService.query();
  }
}());
