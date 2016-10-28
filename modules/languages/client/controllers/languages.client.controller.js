(function () {
  'use strict';

  // Languages controller
  angular
    .module('languages')
    .controller('LanguagesController', LanguagesController);

  LanguagesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'languageResolve'];

  function LanguagesController ($scope, $state, $window, Authentication, language) {
    var vm = this;

    vm.authentication = Authentication;
    vm.language = language;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Language
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.language.$remove($state.go('languages.list'));
      }
    }

    // Save Language
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.languageForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.language._id) {
        vm.language.$update(successCallback, errorCallback);
      } else {
        vm.language.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('languages.view', {
          languageId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
