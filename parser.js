'use strict';

const noop = Function.prototype;

const map = (arr, cb=noop) => [].map.call(arr, cb);
const filter = (arr, cb=noop) => [].filter.call(arr, cb);

function parseIcecastPage($doc) {
  let $cells = $doc.getElementsByTagName('td');
  let $dataCells = filter($cells, $it => $it.getAttribute('class') === 'streamdata');
  let $dataRows = map($dataCells, $it => $it.parentNode);
  let info = parseRows($dataRows);
  let $heading = $doc.getElementsByTagName('h2')[0];
  let [ server ] = $heading.textContent.split(/\s+/g);
  return { server, info };
}

function parseShoutcastPage($doc) {
  let $tables = $doc.getElementsByTagName('table');
  let $content = filter($tables, $it => $it.getAttribute('align') === 'center')[0];
  let $dataRows = $content.getElementsByTagName('tr');
  let info = parseRows($dataRows);
  let server = $doc.getElementsByTagName('a')[0].textContent;
  return { server, info };
}

module.exports = {
  parseIcecastPage,
  parseShoutcastPage
};

function parseRows($rows) {
  let info = {};
  [].forEach.call($rows, $row => {
    let [prop, ...value] = $row.textContent.trim().split(/:\s+/);
    info[prop] = value.join('');
  });
  return info;
}
