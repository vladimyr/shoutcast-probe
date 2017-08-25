'use strict';

module.exports = {
  isNetworkError
};

function isNetworkError(err = {}) {
  const { code } = err;
  return code === 'ECONNRESET' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ESOCKETTIMEDOUT';
}
