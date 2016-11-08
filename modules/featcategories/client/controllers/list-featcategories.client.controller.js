(function () {
  'use strict';

  angular
    .module('featcategories')
    .controller('FeatcategoriesListController', FeatcategoriesListController);

  FeatcategoriesListController.$inject = ['FeatcategoriesService'];

  function FeatcategoriesListController(FeatcategoriesService) {
    var vm = this;

    vm.featcategories = FeatcategoriesService.query();
  }
}());
