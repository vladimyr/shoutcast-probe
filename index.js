'use strict';

const request = require('request');
const minidom = require('minidom');
const noop = Function.prototype;

const ua = 'Mozilla/5.0';

module.exports = fetchStreamInfo;

function fetchStreamInfo(streamUrl, cb=noop) {
  let headers = { 'User-Agent': ua };
  request.get(streamUrl, { headers }, (err, { body: html }={}) => {
    if (err) {
      cb(err);
      return;
    }

    let $doc = minidom(html);
    let info = parseStatusPage($doc);
    cb(null, info);
  });
}

function parseStatusPage($doc) {
  let $tables = $doc.getElementsByTagName('table');
  let $content = [].filter.call($tables, $it => $it.getAttribute('align') === 'center')[0];
  let $lines = $content.getElementsByTagName('tr');
  let info = {};
  [].forEach.call($lines, $line => {
    let [prop, ...value] = $line.textContent.trim().split(/:\s+/);
  	info[prop] = value.join('');
	});
  let server = $doc.getElementsByTagName('a')[0].textContent;
  return { server, info };
}
