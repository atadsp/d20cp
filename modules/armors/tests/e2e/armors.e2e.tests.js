'use strict';

describe('Armors E2E Tests:', function () {
  describe('Test Armors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/armors');
      expect(element.all(by.repeater('armor in armors')).count()).toEqual(0);
    });
  });
});
