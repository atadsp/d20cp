'use strict';

describe('Magicitems E2E Tests:', function () {
  describe('Test Magicitems page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/magicitems');
      expect(element.all(by.repeater('magicitem in magicitems')).count()).toEqual(0);
    });
  });
});
