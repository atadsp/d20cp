'use strict';

describe('Gameversions E2E Tests:', function () {
  describe('Test Gameversions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/gameversions');
      expect(element.all(by.repeater('gameversion in gameversions')).count()).toEqual(0);
    });
  });
});
