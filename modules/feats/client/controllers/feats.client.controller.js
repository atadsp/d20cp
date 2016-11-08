(function () {
  'use strict';

  // Feats controller
  angular
    .module('feats')
    .controller('FeatsController', FeatsController);

  FeatsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'featResolve', 'FeatsService', 'RulebooksService', 'FeatcategoriesService' ,'GameversionsService',];

  function FeatsController ($scope, $state, $window, Authentication, feat, FeatsService, RulebooksService, FeatcategoriesService, GameversionsService) {
    var vm = this;

    vm.options = FeatsService.query();
    vm.rulebooks = RulebooksService.query();
    vm.gameversions = GameversionsService.query();
    vm.featcategories = FeatcategoriesService.query();

    vm.authentication = Authentication;
    vm.feat = feat;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    console.log(vm.options);

    // Remove existing Feat
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.feat.$remove($state.go('feats.list'));
      }
    }

    // Save Feat
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.featForm');
        return false;
      }


      // TODO: move create/update logic to service
      if (vm.feat._id) {
        vm.feat.$update(successCallback, errorCallback);
      } else {
        vm.feat.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('feats.view', {
          featId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    $scope.togglePrereq = function(option){
      var i = 0;
      var prereq = {
        id: option._id,
        name: option.name
          
      }
      var num = 0;
      if(option.checked === true){
        for(i; i < vm.feat.featprereq.length; i++){
          console.log(vm.feat.featprereq[i].id);
          console.log(prereq.id)
          if(vm.feat.featprereq[i].id === prereq.id){
            num++
            console.log(num)
          }

        }
        console.log(num)
        if(num === 0){
          vm.feat.featprereq.push(prereq)
        }

      } else if(option.checked === false){
        for(i; i < vm.feat.featprereq.length; i++){
          if(vm.feat.featprereq[i].id === prereq.id){
            vm.feat.featprereq.splice(prereq)
          }
        }
      }
    }
    $scope.removePrereq = function(option){
      console.log(option)
      var i = 0;
      for(i; i < vm.feat.featprereq.length; i++){
          if(vm.feat.featprereq[i].id === option){
            vm.feat.featprereq.splice(vm.feat.featprereq[i])
          }
        }
      }

    $scope.updateRulebookInfo = function(){
      var book = vm.feat.book;
      var rules = vm.rulebooks;

      for(var i = 0; i< rules.length; i++){
        if(rules[i].name === book){
          vm.feat.gameversion = rules[i].gameversions;
          vm.feat.bookid = rules[i]._id;
          vm.feat.gameversionID = rules[i].gameversionID;
        }
      }
    };

  }
}());
