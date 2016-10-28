(function () {
  'use strict';

  // Klasses controller
  angular
    .module('klasses')
    .controller('KlassesController', KlassesController);

  KlassesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'RulebooksService', 'GameversionsService', 'klassResolve'];

  function KlassesController ($scope, $state, $window, Authentication, RulebooksService, GameversionsService, klass) {
    var vm = this;

    vm.authentication = Authentication;
    vm.klass = klass;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.rulebooks = RulebooksService.query();
    vm.gameversions = GameversionsService.query();

    // Remove existing Klass
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.klass.$remove($state.go('klasses.list'));
      }
    }

    // Save Klass
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.klassForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.klass._id) {
        vm.klass.$update(successCallback, errorCallback);
      } else {
        vm.klass.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('klasses.view', {
          klassId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.change = function(){
      var book = vm.klass.book
      var rules = vm.rulebooks

      for(var i = 0; i< rules.length; i++){
        if(rules[i].name === book){
          vm.klass.gameversion = rules[i].gameversions;
        }
      }
    }
  }
}());
