(function () {
  'use strict';

  describe('Featcategories Route Tests', function () {
    // Initialize global variables
    var $scope,
      FeatcategoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FeatcategoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FeatcategoriesService = _FeatcategoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('featcategories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/featcategories');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FeatcategoriesController,
          mockFeatcategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('featcategories.view');
          $templateCache.put('modules/featcategories/client/views/view-featcategory.client.view.html', '');

          // create mock Featcategory
          mockFeatcategory = new FeatcategoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Featcategory Name'
          });

          // Initialize Controller
          FeatcategoriesController = $controller('FeatcategoriesController as vm', {
            $scope: $scope,
            featcategoryResolve: mockFeatcategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:featcategoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.featcategoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            featcategoryId: 1
          })).toEqual('/featcategories/1');
        }));

        it('should attach an Featcategory to the controller scope', function () {
          expect($scope.vm.featcategory._id).toBe(mockFeatcategory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/featcategories/client/views/view-featcategory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FeatcategoriesController,
          mockFeatcategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('featcategories.create');
          $templateCache.put('modules/featcategories/client/views/form-featcategory.client.view.html', '');

          // create mock Featcategory
          mockFeatcategory = new FeatcategoriesService();

          // Initialize Controller
          FeatcategoriesController = $controller('FeatcategoriesController as vm', {
            $scope: $scope,
            featcategoryResolve: mockFeatcategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.featcategoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/featcategories/create');
        }));

        it('should attach an Featcategory to the controller scope', function () {
          expect($scope.vm.featcategory._id).toBe(mockFeatcategory._id);
          expect($scope.vm.featcategory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/featcategories/client/views/form-featcategory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FeatcategoriesController,
          mockFeatcategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('featcategories.edit');
          $templateCache.put('modules/featcategories/client/views/form-featcategory.client.view.html', '');

          // create mock Featcategory
          mockFeatcategory = new FeatcategoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Featcategory Name'
          });

          // Initialize Controller
          FeatcategoriesController = $controller('FeatcategoriesController as vm', {
            $scope: $scope,
            featcategoryResolve: mockFeatcategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:featcategoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.featcategoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            featcategoryId: 1
          })).toEqual('/featcategories/1/edit');
        }));

        it('should attach an Featcategory to the controller scope', function () {
          expect($scope.vm.featcategory._id).toBe(mockFeatcategory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/featcategories/client/views/form-featcategory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
