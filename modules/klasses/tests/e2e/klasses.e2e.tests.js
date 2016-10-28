'use strict';

describe('Klasses E2E Tests:', function () {
  describe('Test Klasses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/klasses');
      expect(element.all(by.repeater('klass in klasses')).count()).toEqual(0);
    });
  });
});
