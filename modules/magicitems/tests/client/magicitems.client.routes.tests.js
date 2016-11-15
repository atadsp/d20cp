(function () {
  'use strict';

  describe('Magicitems Route Tests', function () {
    // Initialize global variables
    var $scope,
      MagicitemsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MagicitemsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MagicitemsService = _MagicitemsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('magicitems');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/magicitems');
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
          MagicitemsController,
          mockMagicitem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('magicitems.view');
          $templateCache.put('modules/magicitems/client/views/view-magicitem.client.view.html', '');

          // create mock Magicitem
          mockMagicitem = new MagicitemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Magicitem Name'
          });

          // Initialize Controller
          MagicitemsController = $controller('MagicitemsController as vm', {
            $scope: $scope,
            magicitemResolve: mockMagicitem
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:magicitemId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.magicitemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            magicitemId: 1
          })).toEqual('/magicitems/1');
        }));

        it('should attach an Magicitem to the controller scope', function () {
          expect($scope.vm.magicitem._id).toBe(mockMagicitem._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/magicitems/client/views/view-magicitem.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MagicitemsController,
          mockMagicitem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('magicitems.create');
          $templateCache.put('modules/magicitems/client/views/form-magicitem.client.view.html', '');

          // create mock Magicitem
          mockMagicitem = new MagicitemsService();

          // Initialize Controller
          MagicitemsController = $controller('MagicitemsController as vm', {
            $scope: $scope,
            magicitemResolve: mockMagicitem
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.magicitemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/magicitems/create');
        }));

        it('should attach an Magicitem to the controller scope', function () {
          expect($scope.vm.magicitem._id).toBe(mockMagicitem._id);
          expect($scope.vm.magicitem._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/magicitems/client/views/form-magicitem.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MagicitemsController,
          mockMagicitem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('magicitems.edit');
          $templateCache.put('modules/magicitems/client/views/form-magicitem.client.view.html', '');

          // create mock Magicitem
          mockMagicitem = new MagicitemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Magicitem Name'
          });

          // Initialize Controller
          MagicitemsController = $controller('MagicitemsController as vm', {
            $scope: $scope,
            magicitemResolve: mockMagicitem
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:magicitemId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.magicitemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            magicitemId: 1
          })).toEqual('/magicitems/1/edit');
        }));

        it('should attach an Magicitem to the controller scope', function () {
          expect($scope.vm.magicitem._id).toBe(mockMagicitem._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/magicitems/client/views/form-magicitem.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
