(function () {
  'use strict';

  // Weapons controller
  angular
    .module('weapons')
    .controller('WeaponsController', WeaponsController);

  WeaponsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'weaponResolve'];

  function WeaponsController ($scope, $state, $window, Authentication, weapon) {
    var vm = this;

    vm.authentication = Authentication;
    vm.weapon = weapon;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Weapon
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.weapon.$remove($state.go('weapons.list'));
      }
    }

    // Save Weapon
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.weaponForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.weapon._id) {
        vm.weapon.$update(successCallback, errorCallback);
      } else {
        vm.weapon.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('weapons.view', {
          weaponId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
