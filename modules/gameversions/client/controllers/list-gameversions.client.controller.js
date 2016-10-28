(function () {
  'use strict';

  angular
    .module('gameversions')
    .controller('GameversionsListController', GameversionsListController);

  GameversionsListController.$inject = ['GameversionsService'];

  function GameversionsListController(GameversionsService) {
    var vm = this;

    vm.gameversions = GameversionsService.query();
  }
}());
