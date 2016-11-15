(function () {
  'use strict';

  // Mundanes controller
  angular
    .module('mundanes')
    .controller('MundanesController', MundanesController);

  MundanesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'mundaneResolve'];

  function MundanesController ($scope, $state, $window, Authentication, mundane) {
    var vm = this;

    vm.authentication = Authentication;
    vm.mundane = mundane;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Mundane
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.mundane.$remove($state.go('mundanes.list'));
      }
    }

    // Save Mundane
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mundaneForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.mundane._id) {
        vm.mundane.$update(successCallback, errorCallback);
      } else {
        vm.mundane.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mundanes.view', {
          mundaneId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
