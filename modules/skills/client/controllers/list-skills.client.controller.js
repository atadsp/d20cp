(function () {
  'use strict';

  angular
    .module('skills')
    .controller('SkillsListController', SkillsListController);

  SkillsListController.$inject = ['SkillsService'];

  function SkillsListController(SkillsService) {
    var vm = this;

    vm.skills = SkillsService.query();
  }
}());
