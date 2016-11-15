(function () {
  'use strict';

  describe('Psionics Route Tests', function () {
    // Initialize global variables
    var $scope,
      PsionicsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PsionicsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PsionicsService = _PsionicsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('psionics');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/psionics');
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
          PsionicsController,
          mockPsionic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('psionics.view');
          $templateCache.put('modules/psionics/client/views/view-psionic.client.view.html', '');

          // create mock Psionic
          mockPsionic = new PsionicsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Psionic Name'
          });

          // Initialize Controller
          PsionicsController = $controller('PsionicsController as vm', {
            $scope: $scope,
            psionicResolve: mockPsionic
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:psionicId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.psionicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            psionicId: 1
          })).toEqual('/psionics/1');
        }));

        it('should attach an Psionic to the controller scope', function () {
          expect($scope.vm.psionic._id).toBe(mockPsionic._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/psionics/client/views/view-psionic.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PsionicsController,
          mockPsionic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('psionics.create');
          $templateCache.put('modules/psionics/client/views/form-psionic.client.view.html', '');

          // create mock Psionic
          mockPsionic = new PsionicsService();

          // Initialize Controller
          PsionicsController = $controller('PsionicsController as vm', {
            $scope: $scope,
            psionicResolve: mockPsionic
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.psionicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/psionics/create');
        }));

        it('should attach an Psionic to the controller scope', function () {
          expect($scope.vm.psionic._id).toBe(mockPsionic._id);
          expect($scope.vm.psionic._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/psionics/client/views/form-psionic.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PsionicsController,
          mockPsionic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('psionics.edit');
          $templateCache.put('modules/psionics/client/views/form-psionic.client.view.html', '');

          // create mock Psionic
          mockPsionic = new PsionicsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Psionic Name'
          });

          // Initialize Controller
          PsionicsController = $controller('PsionicsController as vm', {
            $scope: $scope,
            psionicResolve: mockPsionic
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:psionicId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.psionicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            psionicId: 1
          })).toEqual('/psionics/1/edit');
        }));

        it('should attach an Psionic to the controller scope', function () {
          expect($scope.vm.psionic._id).toBe(mockPsionic._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/psionics/client/views/form-psionic.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
