(function () {
  'use strict';

  angular
    .module('magicitems')
    .controller('MagicitemsListController', MagicitemsListController);

  MagicitemsListController.$inject = ['MagicitemsService'];

  function MagicitemsListController(MagicitemsService) {
    var vm = this;

    vm.magicitems = MagicitemsService.query();
  }
}());
