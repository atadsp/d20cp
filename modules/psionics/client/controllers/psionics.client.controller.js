(function () {
  'use strict';

  // Psionics controller
  angular
    .module('psionics')
    .controller('PsionicsController', PsionicsController);

  PsionicsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'psionicResolve'];

  function PsionicsController ($scope, $state, $window, Authentication, psionic) {
    var vm = this;

    vm.authentication = Authentication;
    vm.psionic = psionic;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Psionic
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.psionic.$remove($state.go('psionics.list'));
      }
    }

    // Save Psionic
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.psionicForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.psionic._id) {
        vm.psionic.$update(successCallback, errorCallback);
      } else {
        vm.psionic.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('psionics.view', {
          psionicId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
