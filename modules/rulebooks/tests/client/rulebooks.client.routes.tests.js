(function () {
  'use strict';

  describe('Rulebooks Route Tests', function () {
    // Initialize global variables
    var $scope,
      RulebooksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RulebooksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RulebooksService = _RulebooksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('rulebooks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/rulebooks');
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
          RulebooksController,
          mockRulebook;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('rulebooks.view');
          $templateCache.put('modules/rulebooks/client/views/view-rulebook.client.view.html', '');

          // create mock Rulebook
          mockRulebook = new RulebooksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Rulebook Name'
          });

          // Initialize Controller
          RulebooksController = $controller('RulebooksController as vm', {
            $scope: $scope,
            rulebookResolve: mockRulebook
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:rulebookId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.rulebookResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            rulebookId: 1
          })).toEqual('/rulebooks/1');
        }));

        it('should attach an Rulebook to the controller scope', function () {
          expect($scope.vm.rulebook._id).toBe(mockRulebook._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/rulebooks/client/views/view-rulebook.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RulebooksController,
          mockRulebook;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('rulebooks.create');
          $templateCache.put('modules/rulebooks/client/views/form-rulebook.client.view.html', '');

          // create mock Rulebook
          mockRulebook = new RulebooksService();

          // Initialize Controller
          RulebooksController = $controller('RulebooksController as vm', {
            $scope: $scope,
            rulebookResolve: mockRulebook
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.rulebookResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/rulebooks/create');
        }));

        it('should attach an Rulebook to the controller scope', function () {
          expect($scope.vm.rulebook._id).toBe(mockRulebook._id);
          expect($scope.vm.rulebook._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/rulebooks/client/views/form-rulebook.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RulebooksController,
          mockRulebook;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('rulebooks.edit');
          $templateCache.put('modules/rulebooks/client/views/form-rulebook.client.view.html', '');

          // create mock Rulebook
          mockRulebook = new RulebooksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Rulebook Name'
          });

          // Initialize Controller
          RulebooksController = $controller('RulebooksController as vm', {
            $scope: $scope,
            rulebookResolve: mockRulebook
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:rulebookId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.rulebookResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            rulebookId: 1
          })).toEqual('/rulebooks/1/edit');
        }));

        it('should attach an Rulebook to the controller scope', function () {
          expect($scope.vm.rulebook._id).toBe(mockRulebook._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/rulebooks/client/views/form-rulebook.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
