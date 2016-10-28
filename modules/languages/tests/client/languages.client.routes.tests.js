(function () {
  'use strict';

  describe('Languages Route Tests', function () {
    // Initialize global variables
    var $scope,
      LanguagesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LanguagesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LanguagesService = _LanguagesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('languages');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/languages');
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
          LanguagesController,
          mockLanguage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('languages.view');
          $templateCache.put('modules/languages/client/views/view-language.client.view.html', '');

          // create mock Language
          mockLanguage = new LanguagesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Language Name'
          });

          // Initialize Controller
          LanguagesController = $controller('LanguagesController as vm', {
            $scope: $scope,
            languageResolve: mockLanguage
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:languageId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.languageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            languageId: 1
          })).toEqual('/languages/1');
        }));

        it('should attach an Language to the controller scope', function () {
          expect($scope.vm.language._id).toBe(mockLanguage._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/languages/client/views/view-language.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LanguagesController,
          mockLanguage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('languages.create');
          $templateCache.put('modules/languages/client/views/form-language.client.view.html', '');

          // create mock Language
          mockLanguage = new LanguagesService();

          // Initialize Controller
          LanguagesController = $controller('LanguagesController as vm', {
            $scope: $scope,
            languageResolve: mockLanguage
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.languageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/languages/create');
        }));

        it('should attach an Language to the controller scope', function () {
          expect($scope.vm.language._id).toBe(mockLanguage._id);
          expect($scope.vm.language._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/languages/client/views/form-language.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LanguagesController,
          mockLanguage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('languages.edit');
          $templateCache.put('modules/languages/client/views/form-language.client.view.html', '');

          // create mock Language
          mockLanguage = new LanguagesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Language Name'
          });

          // Initialize Controller
          LanguagesController = $controller('LanguagesController as vm', {
            $scope: $scope,
            languageResolve: mockLanguage
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:languageId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.languageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            languageId: 1
          })).toEqual('/languages/1/edit');
        }));

        it('should attach an Language to the controller scope', function () {
          expect($scope.vm.language._id).toBe(mockLanguage._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/languages/client/views/form-language.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
