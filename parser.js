'use strict';

const noop = Function.prototype;

const forEach = (arr, cb = noop) => [].forEach.call(arr, cb);
const filter = (arr, cb = noop) => [].filter.call(arr, cb);
const last = arr => arr[arr.length - 1];

const getText = el => el ? el.textContent.trim() : '';

function parseIcecastPage($doc) {
  const $tables = $doc.getElementsByTagName('table');
  const $info = last($tables);
  const info = parseInfoTable($info);
  const $heading = $doc.getElementsByTagName('h1')[0] ||
                   $doc.getElementsByTagName('h2')[0];
  const [server] = getText($heading).split(/\s+/g);
  return { server, info };
}

function parseShoutcastPage($doc) {
  const $tables = $doc.getElementsByTagName('table');
  const $info = last(filter($tables, $it => $it.getAttribute('align') === 'center'));
  const info = parseInfoTable($info);
  const server = getText($doc.getElementsByTagName('a')[0]);
  return { server, info };
}

module.exports = {
  parseIcecastPage,
  parseShoutcastPage
};

function parseInfoTable($table) {
  const info = {};
  const $rows = $table.getElementsByTagName('tr');
  forEach($rows, $row => {
    const [prop, ...value] = getText($row).split(/:\s*/);
    if (prop) info[prop] = value.join('');
  });
  return info;
}
