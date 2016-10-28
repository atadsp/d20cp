(function () {
  'use strict';

  describe('Gameversions Route Tests', function () {
    // Initialize global variables
    var $scope,
      GameversionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GameversionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GameversionsService = _GameversionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('gameversions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/gameversions');
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
          GameversionsController,
          mockGameversion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('gameversions.view');
          $templateCache.put('modules/gameversions/client/views/view-gameversion.client.view.html', '');

          // create mock Gameversion
          mockGameversion = new GameversionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Gameversion Name'
          });

          // Initialize Controller
          GameversionsController = $controller('GameversionsController as vm', {
            $scope: $scope,
            gameversionResolve: mockGameversion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:gameversionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.gameversionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            gameversionId: 1
          })).toEqual('/gameversions/1');
        }));

        it('should attach an Gameversion to the controller scope', function () {
          expect($scope.vm.gameversion._id).toBe(mockGameversion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/gameversions/client/views/view-gameversion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GameversionsController,
          mockGameversion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('gameversions.create');
          $templateCache.put('modules/gameversions/client/views/form-gameversion.client.view.html', '');

          // create mock Gameversion
          mockGameversion = new GameversionsService();

          // Initialize Controller
          GameversionsController = $controller('GameversionsController as vm', {
            $scope: $scope,
            gameversionResolve: mockGameversion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.gameversionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/gameversions/create');
        }));

        it('should attach an Gameversion to the controller scope', function () {
          expect($scope.vm.gameversion._id).toBe(mockGameversion._id);
          expect($scope.vm.gameversion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/gameversions/client/views/form-gameversion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GameversionsController,
          mockGameversion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('gameversions.edit');
          $templateCache.put('modules/gameversions/client/views/form-gameversion.client.view.html', '');

          // create mock Gameversion
          mockGameversion = new GameversionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Gameversion Name'
          });

          // Initialize Controller
          GameversionsController = $controller('GameversionsController as vm', {
            $scope: $scope,
            gameversionResolve: mockGameversion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:gameversionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.gameversionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            gameversionId: 1
          })).toEqual('/gameversions/1/edit');
        }));

        it('should attach an Gameversion to the controller scope', function () {
          expect($scope.vm.gameversion._id).toBe(mockGameversion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/gameversions/client/views/form-gameversion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
