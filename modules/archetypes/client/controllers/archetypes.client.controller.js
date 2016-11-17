(function() {
  'use strict';

  // Archetypes controller
  angular
    .module('archetypes')
    .controller('ArchetypesController', ArchetypesController);

  ArchetypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'archetypeResolve', 'KlassesService', 'RulebooksService'];

  function ArchetypesController($scope, $state, $window, Authentication, archetype, KlassesService, RulebooksService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.archetype = archetype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.klasses = KlassesService.query();
    vm.rulebooks = RulebooksService.query();

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
    $scope.originalClassInfo = function() {
      var archetype = vm.archetype;
      var klass = vm.klasses;


      for (var i = 0; i < klass.length; i++) {
        if (klass[i]._id === archetype.originalClassID) {
          vm.archetype.originalClass = klass[i].name;
        }
      }
    };
    $scope.updateRulebookInfo = function() {
      var book = vm.archetype.book;
      var rules = vm.rulebooks;

      for (var i = 0; i < rules.length; i++) {
        if (rules[i].name === book) {
          vm.archetype.book = book;
          vm.archetype.gameversion = rules[i].gameversions;
          vm.archetype.bookid = rules[i]._id;
          vm.archetype.gameversionID = rules[i].gameversionID;
        }
      }
    };
  }
}());