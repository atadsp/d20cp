(function () {
  'use strict';

  // Deities controller
  angular
    .module('deities')
    .controller('DeitiesController', DeitiesController);

  DeitiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'deityResolve'];

  function DeitiesController ($scope, $state, $window, Authentication, deity) {
    var vm = this;

    vm.authentication = Authentication;
    vm.deity = deity;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Deity
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.deity.$remove($state.go('deities.list'));
      }
    }

    // Save Deity
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.deityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.deity._id) {
        vm.deity.$update(successCallback, errorCallback);
      } else {
        vm.deity.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('deities.view', {
          deityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
