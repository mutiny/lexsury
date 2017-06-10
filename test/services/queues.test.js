const assert = require('assert');
const app = require('../../src/app');

describe('\'queues\' service', () => {
  it('registered the service', () => {
    const service = app.service('queues');

    assert.ok(service, 'Registered the service');
  });
});
