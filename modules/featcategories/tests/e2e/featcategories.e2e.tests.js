'use strict';

describe('Featcategories E2E Tests:', function () {
  describe('Test Featcategories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/featcategories');
      expect(element.all(by.repeater('featcategory in featcategories')).count()).toEqual(0);
    });
  });
});
