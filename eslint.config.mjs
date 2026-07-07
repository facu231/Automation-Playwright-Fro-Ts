import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const nodeGlobals = {
  Buffer: 'readonly',
  console: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
  setTimeout: 'readonly',
  URL: 'readonly'
};

export default [
  {
    ignores: [
      'node_modules/',
      '.pnpm-store/',
      'dist/',
      'reports/',
      'screenshots/',
      'videos/',
      'traces/',
      'test-results/',
      'playwright-report/'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: nodeGlobals
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      globals: nodeGlobals
    }
  },
  prettier
];
