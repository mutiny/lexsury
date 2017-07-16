const assert = require('assert');
const censor = require('../../src/hooks/censor');

describe('\'censor\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    mock.data = { text: 'how big is the fucking universe?' };
    // Initialize our hook with no options
    const hook = censor();
    // Run the hook
    hook(mock);
    // Run the hook function
    return assert(mock.data.text.includes('*'), 'Replaces swears with *');
  });
});
