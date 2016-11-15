(function () {
  'use strict';

  describe('Armors Route Tests', function () {
    // Initialize global variables
    var $scope,
      ArmorsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ArmorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ArmorsService = _ArmorsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('armors');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/armors');
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
          ArmorsController,
          mockArmor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('armors.view');
          $templateCache.put('modules/armors/client/views/view-armor.client.view.html', '');

          // create mock Armor
          mockArmor = new ArmorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Armor Name'
          });

          // Initialize Controller
          ArmorsController = $controller('ArmorsController as vm', {
            $scope: $scope,
            armorResolve: mockArmor
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:armorId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.armorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            armorId: 1
          })).toEqual('/armors/1');
        }));

        it('should attach an Armor to the controller scope', function () {
          expect($scope.vm.armor._id).toBe(mockArmor._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/armors/client/views/view-armor.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ArmorsController,
          mockArmor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('armors.create');
          $templateCache.put('modules/armors/client/views/form-armor.client.view.html', '');

          // create mock Armor
          mockArmor = new ArmorsService();

          // Initialize Controller
          ArmorsController = $controller('ArmorsController as vm', {
            $scope: $scope,
            armorResolve: mockArmor
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.armorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/armors/create');
        }));

        it('should attach an Armor to the controller scope', function () {
          expect($scope.vm.armor._id).toBe(mockArmor._id);
          expect($scope.vm.armor._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/armors/client/views/form-armor.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ArmorsController,
          mockArmor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('armors.edit');
          $templateCache.put('modules/armors/client/views/form-armor.client.view.html', '');

          // create mock Armor
          mockArmor = new ArmorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Armor Name'
          });

          // Initialize Controller
          ArmorsController = $controller('ArmorsController as vm', {
            $scope: $scope,
            armorResolve: mockArmor
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:armorId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.armorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            armorId: 1
          })).toEqual('/armors/1/edit');
        }));

        it('should attach an Armor to the controller scope', function () {
          expect($scope.vm.armor._id).toBe(mockArmor._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/armors/client/views/form-armor.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
