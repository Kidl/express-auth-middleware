module.exports = {
  'extends': [
    'airbnb-base',
    'plugin:node/recommended',
  ],
  'rules': {
    'no-use-before-define': ['error', {'functions': false}],
    'no-underscore-dangle': ['error', { 'allow': ['_id', '_queue'] }],
    'no-mixed-operators': 1,
    'no-console': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    'no-shadow': 0,
    'max-len': 1,
  },
};
