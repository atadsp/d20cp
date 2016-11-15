'use strict';

describe('Psionics E2E Tests:', function () {
  describe('Test Psionics page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/psionics');
      expect(element.all(by.repeater('psionic in psionics')).count()).toEqual(0);
    });
  });
});
