(function () {
  'use strict';

  // Magicitems controller
  angular
    .module('magicitems')
    .controller('MagicitemsController', MagicitemsController);

  MagicitemsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'magicitemResolve'];

  function MagicitemsController ($scope, $state, $window, Authentication, magicitem) {
    var vm = this;

    vm.authentication = Authentication;
    vm.magicitem = magicitem;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Magicitem
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.magicitem.$remove($state.go('magicitems.list'));
      }
    }

    // Save Magicitem
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.magicitemForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.magicitem._id) {
        vm.magicitem.$update(successCallback, errorCallback);
      } else {
        vm.magicitem.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('magicitems.view', {
          magicitemId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
