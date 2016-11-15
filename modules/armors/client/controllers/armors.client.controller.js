(function () {
  'use strict';

  // Armors controller
  angular
    .module('armors')
    .controller('ArmorsController', ArmorsController);

  ArmorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'armorResolve'];

  function ArmorsController ($scope, $state, $window, Authentication, armor) {
    var vm = this;

    vm.authentication = Authentication;
    vm.armor = armor;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Armor
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.armor.$remove($state.go('armors.list'));
      }
    }

    // Save Armor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.armorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.armor._id) {
        vm.armor.$update(successCallback, errorCallback);
      } else {
        vm.armor.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('armors.view', {
          armorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
