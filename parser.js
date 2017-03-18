'use strict';

const noop = Function.prototype;

const filter = (arr, cb=noop) => [].filter.call(arr, cb);
const last = arr => arr[arr.length - 1];

function parseIcecastPage($doc) {
  let $tables = $doc.getElementsByTagName('table');
  let $info = last($tables);
  let info = parseInfoTable($info);
  let $heading = $doc.getElementsByTagName('h1')[0] ||
                 $doc.getElementsByTagName('h2')[0];
  let [ server ] = $heading.textContent.split(/\s+/g);
  return { server, info };
}

function parseShoutcastPage($doc) {
  let $tables = $doc.getElementsByTagName('table');
  let $info = filter($tables, $it => $it.getAttribute('align') === 'center')[0];
  let info = parseInfoTable($info);
  let server = $doc.getElementsByTagName('a')[0].textContent;
  return { server, info };
}

module.exports = {
  parseIcecastPage,
  parseShoutcastPage
};

function parseInfoTable($table) {
  let info = {};
  let $rows = $table.getElementsByTagName('tr');
  [].forEach.call($rows, $row => {
    let [prop, ...value] = $row.textContent.trim().split(/:\s*/);
    info[prop] = value.join('');
  });
  return info;
}
