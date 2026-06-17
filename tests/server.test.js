const fs = require('fs');
const path = require('path');
const vm = require('vm');

global.renderData = vi.fn();
global.$request = {
  invokeTemplate: vi.fn(() => Promise.resolve({ status: 200, response: '{}' }))
};

function loadFdkServer(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = {
    exports: {},
    $request: global.$request,
    renderData: global.renderData,
    console: console
  };
  vm.runInNewContext(code, sandbox, { filename: filePath });
  return sandbox.exports;
}

const server = loadFdkServer(path.join(__dirname, '../server/server.js'));

describe('server.js', function () {
  beforeEach(function () {
    vi.clearAllMocks();
  });

  test('invokeRequestTemplate is exported', function () {
    expect(server.invokeRequestTemplate).toBeDefined();
    expect(typeof server.invokeRequestTemplate).toBe('function');
  });

  test('invokeRequestTemplate calls $request.invokeTemplate', async function () {
    await server.invokeRequestTemplate({
      templateName: 'publicGet',
      context: { host: 'swapi.dev', path: '/api/people/1' }
    });
    expect($request.invokeTemplate).toHaveBeenCalledWith('publicGet', {
      context: { host: 'swapi.dev', path: '/api/people/1' }
    });
    expect(renderData).toHaveBeenCalledWith(null, { status: 200, response: '{}' });
  });

  test('invokeRequestTemplate requires templateName', async function () {
    await server.invokeRequestTemplate({});
    expect(renderData).toHaveBeenCalledWith({ message: 'templateName is required' });
  });
});
