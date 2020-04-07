module.exports = {
  plugins: {
    'postcss-import': {
      root: __dirname,
    },
    'postcss-apply': {},
    'postcss-extend': {},
    'postcss-nested': {},
    'postcss-mixins': {},
    'postcss-each': {},
    'postcss-cssnext': {},
    'postcss-reporter': { clearMessages: true }
  },
};
