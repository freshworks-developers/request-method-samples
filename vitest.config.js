import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/unit',
      reporter: ['json', 'text'],
      include: ['server/**/*.js', 'app/scripts/**/*.js']
    },
    environmentMatchGlobs: [
      ['tests/server*.js', 'node'],
      ['tests/app*.js', 'jsdom']
    ]
  }
});
