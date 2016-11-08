(function () {
  'use strict';

  // Featcategories controller
  angular
    .module('featcategories')
    .controller('FeatcategoriesController', FeatcategoriesController);

  FeatcategoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'featcategoryResolve'];

  function FeatcategoriesController ($scope, $state, $window, Authentication, featcategory) {
    var vm = this;

    vm.authentication = Authentication;
    vm.featcategory = featcategory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Featcategory
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.featcategory.$remove($state.go('featcategories.list'));
      }
    }

    // Save Featcategory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.featcategoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.featcategory._id) {
        vm.featcategory.$update(successCallback, errorCallback);
      } else {
        vm.featcategory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('featcategories.view', {
          featcategoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
