(function () {
  'use strict';

  describe('Archetypes Route Tests', function () {
    // Initialize global variables
    var $scope,
      ArchetypesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ArchetypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ArchetypesService = _ArchetypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('archetypes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/archetypes');
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
          ArchetypesController,
          mockArchetype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('archetypes.view');
          $templateCache.put('modules/archetypes/client/views/view-archetype.client.view.html', '');

          // create mock Archetype
          mockArchetype = new ArchetypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Archetype Name'
          });

          // Initialize Controller
          ArchetypesController = $controller('ArchetypesController as vm', {
            $scope: $scope,
            archetypeResolve: mockArchetype
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:archetypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.archetypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            archetypeId: 1
          })).toEqual('/archetypes/1');
        }));

        it('should attach an Archetype to the controller scope', function () {
          expect($scope.vm.archetype._id).toBe(mockArchetype._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/archetypes/client/views/view-archetype.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ArchetypesController,
          mockArchetype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('archetypes.create');
          $templateCache.put('modules/archetypes/client/views/form-archetype.client.view.html', '');

          // create mock Archetype
          mockArchetype = new ArchetypesService();

          // Initialize Controller
          ArchetypesController = $controller('ArchetypesController as vm', {
            $scope: $scope,
            archetypeResolve: mockArchetype
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.archetypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/archetypes/create');
        }));

        it('should attach an Archetype to the controller scope', function () {
          expect($scope.vm.archetype._id).toBe(mockArchetype._id);
          expect($scope.vm.archetype._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/archetypes/client/views/form-archetype.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ArchetypesController,
          mockArchetype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('archetypes.edit');
          $templateCache.put('modules/archetypes/client/views/form-archetype.client.view.html', '');

          // create mock Archetype
          mockArchetype = new ArchetypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Archetype Name'
          });

          // Initialize Controller
          ArchetypesController = $controller('ArchetypesController as vm', {
            $scope: $scope,
            archetypeResolve: mockArchetype
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:archetypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.archetypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            archetypeId: 1
          })).toEqual('/archetypes/1/edit');
        }));

        it('should attach an Archetype to the controller scope', function () {
          expect($scope.vm.archetype._id).toBe(mockArchetype._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/archetypes/client/views/form-archetype.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
