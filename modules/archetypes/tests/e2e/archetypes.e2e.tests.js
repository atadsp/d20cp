'use strict';

describe('Archetypes E2E Tests:', function () {
  describe('Test Archetypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/archetypes');
      expect(element.all(by.repeater('archetype in archetypes')).count()).toEqual(0);
    });
  });
});
