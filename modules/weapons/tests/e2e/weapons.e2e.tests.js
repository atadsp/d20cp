'use strict';

describe('Weapons E2E Tests:', function () {
  describe('Test Weapons page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/weapons');
      expect(element.all(by.repeater('weapon in weapons')).count()).toEqual(0);
    });
  });
});
