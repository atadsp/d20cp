(function () {
  'use strict';

  // Gameversions controller
  angular
    .module('gameversions')
    .controller('GameversionsController', GameversionsController);

  GameversionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'gameversionResolve', ];

  function GameversionsController ($scope, $state, $window, Authentication, gameversion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.gameversion = gameversion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Gameversion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.gameversion.$remove($state.go('gameversions.list'));
      }
    }

    // Save Gameversion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gameversionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.gameversion._id) {
        vm.gameversion.$update(successCallback, errorCallback);
      } else {
        vm.gameversion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('gameversions.view', {
          gameversionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
