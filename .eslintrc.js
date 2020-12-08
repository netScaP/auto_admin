module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'switch-colon-spacing': ['error', { after: true, before: false }],
    'vue/max-attributes-per-line': false,
    'vue/html-self-closing': false,
    'no-unused-vars': 1,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
