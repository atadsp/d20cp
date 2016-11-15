(function () {
  'use strict';

  describe('Weapons Route Tests', function () {
    // Initialize global variables
    var $scope,
      WeaponsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _WeaponsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      WeaponsService = _WeaponsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('weapons');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/weapons');
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
          WeaponsController,
          mockWeapon;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('weapons.view');
          $templateCache.put('modules/weapons/client/views/view-weapon.client.view.html', '');

          // create mock Weapon
          mockWeapon = new WeaponsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Weapon Name'
          });

          // Initialize Controller
          WeaponsController = $controller('WeaponsController as vm', {
            $scope: $scope,
            weaponResolve: mockWeapon
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:weaponId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.weaponResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            weaponId: 1
          })).toEqual('/weapons/1');
        }));

        it('should attach an Weapon to the controller scope', function () {
          expect($scope.vm.weapon._id).toBe(mockWeapon._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/weapons/client/views/view-weapon.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          WeaponsController,
          mockWeapon;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('weapons.create');
          $templateCache.put('modules/weapons/client/views/form-weapon.client.view.html', '');

          // create mock Weapon
          mockWeapon = new WeaponsService();

          // Initialize Controller
          WeaponsController = $controller('WeaponsController as vm', {
            $scope: $scope,
            weaponResolve: mockWeapon
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.weaponResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/weapons/create');
        }));

        it('should attach an Weapon to the controller scope', function () {
          expect($scope.vm.weapon._id).toBe(mockWeapon._id);
          expect($scope.vm.weapon._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/weapons/client/views/form-weapon.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          WeaponsController,
          mockWeapon;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('weapons.edit');
          $templateCache.put('modules/weapons/client/views/form-weapon.client.view.html', '');

          // create mock Weapon
          mockWeapon = new WeaponsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Weapon Name'
          });

          // Initialize Controller
          WeaponsController = $controller('WeaponsController as vm', {
            $scope: $scope,
            weaponResolve: mockWeapon
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:weaponId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.weaponResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            weaponId: 1
          })).toEqual('/weapons/1/edit');
        }));

        it('should attach an Weapon to the controller scope', function () {
          expect($scope.vm.weapon._id).toBe(mockWeapon._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/weapons/client/views/form-weapon.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
