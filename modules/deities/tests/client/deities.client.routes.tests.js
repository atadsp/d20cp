(function () {
  'use strict';

  describe('Deities Route Tests', function () {
    // Initialize global variables
    var $scope,
      DeitiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DeitiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DeitiesService = _DeitiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('deities');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/deities');
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
          DeitiesController,
          mockDeity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('deities.view');
          $templateCache.put('modules/deities/client/views/view-deity.client.view.html', '');

          // create mock Deity
          mockDeity = new DeitiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Deity Name'
          });

          // Initialize Controller
          DeitiesController = $controller('DeitiesController as vm', {
            $scope: $scope,
            deityResolve: mockDeity
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:deityId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.deityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            deityId: 1
          })).toEqual('/deities/1');
        }));

        it('should attach an Deity to the controller scope', function () {
          expect($scope.vm.deity._id).toBe(mockDeity._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/deities/client/views/view-deity.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DeitiesController,
          mockDeity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('deities.create');
          $templateCache.put('modules/deities/client/views/form-deity.client.view.html', '');

          // create mock Deity
          mockDeity = new DeitiesService();

          // Initialize Controller
          DeitiesController = $controller('DeitiesController as vm', {
            $scope: $scope,
            deityResolve: mockDeity
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.deityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/deities/create');
        }));

        it('should attach an Deity to the controller scope', function () {
          expect($scope.vm.deity._id).toBe(mockDeity._id);
          expect($scope.vm.deity._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/deities/client/views/form-deity.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DeitiesController,
          mockDeity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('deities.edit');
          $templateCache.put('modules/deities/client/views/form-deity.client.view.html', '');

          // create mock Deity
          mockDeity = new DeitiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Deity Name'
          });

          // Initialize Controller
          DeitiesController = $controller('DeitiesController as vm', {
            $scope: $scope,
            deityResolve: mockDeity
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:deityId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.deityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            deityId: 1
          })).toEqual('/deities/1/edit');
        }));

        it('should attach an Deity to the controller scope', function () {
          expect($scope.vm.deity._id).toBe(mockDeity._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/deities/client/views/form-deity.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
