(function () {
  'use strict';

  // Skills controller
  angular
    .module('skills')
    .controller('SkillsController', SkillsController);

  SkillsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'skillResolve'];

  function SkillsController ($scope, $state, $window, Authentication, skill) {
    var vm = this;

    vm.authentication = Authentication;
    vm.skill = skill;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
  }
}());
