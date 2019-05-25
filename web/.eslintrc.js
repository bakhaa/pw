module.exports = {
    extends: ['airbnb'],
    env: {
      jest: true,
    },
    globals: {
      document: 1,
      shallowToJson: 1,
      createShallow: 1,
      window: 1,
    },
    rules: {
      'react/jsx-filename-extension': 0,
      'import/no-extraneous-dependencies': 0,
      'react/sort-comp': 0,
      'class-methods-use-this': 0,
      'import/prefer-default-export': 0,
      'import/no-named-as-default': 0,
      'react/forbid-prop-types': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'arrow-parens': 0,
      'object-curly-newline': 0,
      'react/require-default-props': 0,
      'react/no-array-index-key': 0,
      'no-underscore-dangle': 0,
      'react/jsx-one-expression-per-line': 0,
      'no-extra-boolean-cast': 0,
    },
  };
  