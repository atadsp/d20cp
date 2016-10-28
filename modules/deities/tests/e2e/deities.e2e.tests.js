'use strict';

describe('Deities E2E Tests:', function () {
  describe('Test Deities page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/deities');
      expect(element.all(by.repeater('deity in deities')).count()).toEqual(0);
    });
  });
});
