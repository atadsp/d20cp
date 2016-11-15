(function () {
  'use strict';

  describe('Mundanes Route Tests', function () {
    // Initialize global variables
    var $scope,
      MundanesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MundanesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MundanesService = _MundanesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mundanes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mundanes');
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
          MundanesController,
          mockMundane;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mundanes.view');
          $templateCache.put('modules/mundanes/client/views/view-mundane.client.view.html', '');

          // create mock Mundane
          mockMundane = new MundanesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mundane Name'
          });

          // Initialize Controller
          MundanesController = $controller('MundanesController as vm', {
            $scope: $scope,
            mundaneResolve: mockMundane
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mundaneId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mundaneResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mundaneId: 1
          })).toEqual('/mundanes/1');
        }));

        it('should attach an Mundane to the controller scope', function () {
          expect($scope.vm.mundane._id).toBe(mockMundane._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mundanes/client/views/view-mundane.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MundanesController,
          mockMundane;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mundanes.create');
          $templateCache.put('modules/mundanes/client/views/form-mundane.client.view.html', '');

          // create mock Mundane
          mockMundane = new MundanesService();

          // Initialize Controller
          MundanesController = $controller('MundanesController as vm', {
            $scope: $scope,
            mundaneResolve: mockMundane
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mundaneResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mundanes/create');
        }));

        it('should attach an Mundane to the controller scope', function () {
          expect($scope.vm.mundane._id).toBe(mockMundane._id);
          expect($scope.vm.mundane._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mundanes/client/views/form-mundane.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MundanesController,
          mockMundane;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mundanes.edit');
          $templateCache.put('modules/mundanes/client/views/form-mundane.client.view.html', '');

          // create mock Mundane
          mockMundane = new MundanesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mundane Name'
          });

          // Initialize Controller
          MundanesController = $controller('MundanesController as vm', {
            $scope: $scope,
            mundaneResolve: mockMundane
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mundaneId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mundaneResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mundaneId: 1
          })).toEqual('/mundanes/1/edit');
        }));

        it('should attach an Mundane to the controller scope', function () {
          expect($scope.vm.mundane._id).toBe(mockMundane._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mundanes/client/views/form-mundane.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
