import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockClient = {
  request: {
    invoke: vi.fn(() => Promise.resolve({ response: { status: 200, response: '{}' } })),
    invokeTemplate: vi.fn(() => Promise.resolve({ status: 200, response: '{}' }))
  }
};

global.app = {
  initialized: vi.fn(() => Promise.resolve(mockClient))
};

describe('request-kit.js', function () {
  beforeEach(function () {
    vi.clearAllMocks();
    vi.resetModules();
    delete global.RequestKit;
    delete global.RequestObjects;
  });

  test('RequestKit invokeViaSmi calls client.request.invoke', async function () {
    await import('../app/scripts/request-kit.js');
    RequestKit.setClient(mockClient);
    await RequestKit.invokeViaSmi('publicGet', { host: 'swapi.dev' });
    expect(mockClient.request.invoke).toHaveBeenCalledWith('invokeRequestTemplate', {
      templateName: 'publicGet',
      context: { host: 'swapi.dev' }
    });
  });

  test('RequestKit invokeWithCache passes cache options', async function () {
    await import('../app/scripts/request-kit.js');
    RequestKit.setClient(mockClient);
    await RequestKit.invokeWithCache('publicGet', { host: 'swapi.dev' }, 30000);
    expect(mockClient.request.invokeTemplate).toHaveBeenCalledWith('publicGet', {
      context: { host: 'swapi.dev' },
      cache: true,
      ttl: 30000
    });
  });

  test('RequestObjects documents all template keys', async function () {
    await import('../app/scripts/request-objects.js');
    const keys = RequestObjects.templates.map(function (t) { return t.key; });
    expect(keys).toContain('publicGet');
    expect(keys).toContain('iparamHostGet');
    expect(keys).toContain('postWithBody');
    expect(RequestObjects.substitutions.length).toBeGreaterThan(4);
  });
});
