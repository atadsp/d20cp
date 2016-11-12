(function () {
  'use strict';

  // Skills controller
  angular
    .module('skills')
    .controller('SkillsController', SkillsController);

  SkillsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'skillResolve', 'RulebooksService','GameversionsService'];

  function SkillsController ($scope, $state, $window, Authentication, skill, RulebooksService, GameversionsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.skill = skill;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.rulebooks = RulebooksService.query();
    vm.gameversions = GameversionsService.query();

    // Remove existing Skill
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.skill.$remove($state.go('skills.list'));
      }
    }

    // Save Skill
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.skillForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.skill._id) {
        vm.skill.$update(successCallback, errorCallback);
      } else {
        vm.skill.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('skills.view', {
          skillId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    $scope.updateRulebookInfo = function(){
      var book = vm.skill.book;
      var rules = vm.rulebooks;

      for(var i = 0; i< rules.length; i++){
        if(rules[i].name === book){
          vm.skill.gameversion = rules[i].gameversions;
          vm.skill.bookid = rules[i]._id;
          vm.skill.gameversionID = rules[i].gameversionID;
        }
      }
    };
  }
}());
