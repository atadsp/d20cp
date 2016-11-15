(function () {
  'use strict';

  angular
    .module('archetypes')
    .controller('ArchetypesListController', ArchetypesListController);

  ArchetypesListController.$inject = ['ArchetypesService'];

  function ArchetypesListController(ArchetypesService) {
    var vm = this;

    vm.archetypes = ArchetypesService.query();
  }
}());
