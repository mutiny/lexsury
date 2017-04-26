const assert = require('assert')
const app = require('../../src/app')

describe('\'queue\' service', () => {
  it('registered the service', () => {
    const service = app.service('queue')

    assert.ok(service, 'Registered the service')
  })
})
