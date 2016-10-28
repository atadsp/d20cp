(function () {
  'use strict';

  describe('Klasses Route Tests', function () {
    // Initialize global variables
    var $scope,
      KlassesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _KlassesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      KlassesService = _KlassesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('klasses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/klasses');
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
          KlassesController,
          mockKlass;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('klasses.view');
          $templateCache.put('modules/klasses/client/views/view-klass.client.view.html', '');

          // create mock Klass
          mockKlass = new KlassesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Klass Name'
          });

          // Initialize Controller
          KlassesController = $controller('KlassesController as vm', {
            $scope: $scope,
            klassResolve: mockKlass
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:klassId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.klassResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            klassId: 1
          })).toEqual('/klasses/1');
        }));

        it('should attach an Klass to the controller scope', function () {
          expect($scope.vm.klass._id).toBe(mockKlass._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/klasses/client/views/view-klass.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          KlassesController,
          mockKlass;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('klasses.create');
          $templateCache.put('modules/klasses/client/views/form-klass.client.view.html', '');

          // create mock Klass
          mockKlass = new KlassesService();

          // Initialize Controller
          KlassesController = $controller('KlassesController as vm', {
            $scope: $scope,
            klassResolve: mockKlass
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.klassResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/klasses/create');
        }));

        it('should attach an Klass to the controller scope', function () {
          expect($scope.vm.klass._id).toBe(mockKlass._id);
          expect($scope.vm.klass._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/klasses/client/views/form-klass.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          KlassesController,
          mockKlass;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('klasses.edit');
          $templateCache.put('modules/klasses/client/views/form-klass.client.view.html', '');

          // create mock Klass
          mockKlass = new KlassesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Klass Name'
          });

          // Initialize Controller
          KlassesController = $controller('KlassesController as vm', {
            $scope: $scope,
            klassResolve: mockKlass
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:klassId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.klassResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            klassId: 1
          })).toEqual('/klasses/1/edit');
        }));

        it('should attach an Klass to the controller scope', function () {
          expect($scope.vm.klass._id).toBe(mockKlass._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/klasses/client/views/form-klass.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
