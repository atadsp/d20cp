(function () {
  'use strict';

  // Rulebooks controller
  angular
    .module('rulebooks')
    .controller('RulebooksController', RulebooksController);

  RulebooksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'rulebookResolve', 'GameversionsService'];

  function RulebooksController ($scope, $state, $window, Authentication, rulebook, GameversionsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.rulebook = rulebook;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.gameversions = GameversionsService.query();

    // Remove existing Rulebook
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.rulebook.$remove($state.go('rulebooks.list'));
      }
    }

    // Save Rulebook
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.rulebookForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.rulebook._id) {
        vm.rulebook.$update(successCallback, errorCallback);
      } else {
        vm.rulebook.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('rulebooks.view', {
          rulebookId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }

      $scope.updateGameID = function(){
      var book = vm.rulebook.gameversions;
      var gameversions = vm.gameversions;
      console.log(book);

      for(var i = 0; i< gameversions.length; i++){
        if(gameversions[i].name === book){
          vm.rulebook.gameversionID = gameversions[i]._id;
        }
      }
    };
  }
}());
