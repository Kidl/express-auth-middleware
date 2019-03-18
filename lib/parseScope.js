function parseScope(scope) {
  const result = {};

  scope = scope + '';

  if (scope) {
    result.service = scope.split('_')[0];
    result.method = scope.split('_')[1];
    result.route = scope.split(':')[0].split('_')[2];
    result.paramname = scope.split(':')[1];
  }

  return result;
}

module.exports = parseScope;
