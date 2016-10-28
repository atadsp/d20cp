'use strict';

describe('Languages E2E Tests:', function () {
  describe('Test Languages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/languages');
      expect(element.all(by.repeater('language in languages')).count()).toEqual(0);
    });
  });
});
