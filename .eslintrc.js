module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'semistandard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.json'
    ]
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    // Disable prop-types, because we already have TS
    "react/prop-types": "off",
    // Hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // FIXME Remove all these rules!
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
