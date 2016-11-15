(function() {
  'use strict';

  // Klasses controller
  angular
    .module('klasses')
    .controller('KlassesController', KlassesController);

  KlassesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'RulebooksService', 'FeatsService', 'GameversionsService', 'klassResolve', 'SkillsService'];

  function KlassesController($scope, $state, $window, Authentication, RulebooksService, FeatsService, GameversionsService, klass, SkillsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.klass = klass;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.options = FeatsService.query();
    vm.rulebooks = RulebooksService.query();
    vm.gameversions = GameversionsService.query();
    vm.skills = SkillsService.query();

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
        var i = 0;
        for (i; i < vm.klass.numlevels; i++) {
          if (vm.klass.advancement[i] === undefined) {
            vm.klass.advancement[i] = {};
          }
        }
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

    $scope.updateRulebookInfo = function() {
      var book = vm.klass.book;
      var rules = vm.rulebooks;

      for (var i = 0; i < rules.length; i++) {
        if (rules[i].name === book) {
          vm.klass.gameversion = rules[i].gameversions;
          vm.klass.bookid = rules[i]._id;
          vm.klass.gameversionID = rules[i].gameversionID;
        }
      }
    };
    $scope.level = function(numlevel) {
      return new Array(numlevel);
    };

    $scope.togglePrereq = function(option) {
      var i = 0;
      var prereq = {
        id: option._id,
        name: option.name

      };
      var num = 0;
      if (option.checked === true) {
        for (i; i < vm.klass.featrequirment.length; i++) {
          if (vm.klass.featrequirment[i].id === prereq.id) {
            num++;
          }

        }
        if (num === 0) {
          vm.klass.featrequirment.push(prereq);
        }

      } else if (option.checked === false) {
        for (i; i < vm.klass.featrequirment.length; i++) {
          if (vm.klass.featrequirment[i].id === prereq.id) {
            vm.klass.featrequirment.splice(vm.klass.featrequirment[i], 1);
          }
        }
      }
    };
    $scope.removePrereq = function(option) {
      var i = 0;
      for (i; i < vm.klass.featrequirment.length; i++) {
        if (vm.klass.featrequirment[i].id === option) {
          vm.klass.featrequirment.splice(vm.klass.featrequirment[i], 1);
        }
      }
    };
    $scope.toggleSkills = function(skill) {
      var i = 0;
      var num = 0;
      var trainedSkill = {
        id: skill._id,
        name: skill.name,
        ability: skill.keyAbility
      };
      if (skill.checked === true) {
        for (i; i < vm.klass.classskills.length; i++) {
          if (vm.klass.classskills[i].id === trainedSkill.id) {
            num++;
          }
        }
        if (num === 0) {
          vm.klass.classskills.push(trainedSkill);
        }
      } else if (skill.checked === false) {
        for (i; i < vm.klass.classskills.length; i++) {
          if (vm.klass.classskills[i].id === trainedSkill.id) {
            vm.klass.classskills.splice(vm.klass.classskills[i], 1);
          }
        }
      }
    };
    $scope.removeSkill = function(skillid) {
      var i = 0;
      for (i; i < vm.klass.classskills.length; i++) {
        if (vm.klass.classskills[i].id === skillid) {
          vm.klass.classskills.splice(vm.klass.classskills[i], 1);
        }
      }
    };
  }


}());