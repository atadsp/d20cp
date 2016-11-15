(function () {
  'use strict';

  // Archetypes controller
  angular
    .module('archetypes')
    .controller('ArchetypesController', ArchetypesController);

  ArchetypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'archetypeResolve'];

  function ArchetypesController ($scope, $state, $window, Authentication, archetype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.archetype = archetype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Archetype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.archetype.$remove($state.go('archetypes.list'));
      }
    }

    // Save Archetype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.archetypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.archetype._id) {
        vm.archetype.$update(successCallback, errorCallback);
      } else {
        vm.archetype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('archetypes.view', {
          archetypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
