'use strict';

describe('Mundanes E2E Tests:', function () {
  describe('Test Mundanes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mundanes');
      expect(element.all(by.repeater('mundane in mundanes')).count()).toEqual(0);
    });
  });
});
