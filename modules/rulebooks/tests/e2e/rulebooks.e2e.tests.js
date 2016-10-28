'use strict';

describe('Rulebooks E2E Tests:', function () {
  describe('Test Rulebooks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/rulebooks');
      expect(element.all(by.repeater('rulebook in rulebooks')).count()).toEqual(0);
    });
  });
});
