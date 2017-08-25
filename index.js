'use strict';

const request = require('request');
const minidom = require('minidom');
const { parseIcecastPage, parseShoutcastPage } = require('./parser');
const noop = Function.prototype;

const ua = 'Mozilla/5.0';
const timeout = 5000; // ms

module.exports = fetchStreamInfo;

function fetchStreamInfo(streamUrl, cb = noop) {
  const headers = { 'User-Agent': ua };
  const options = { headers, timeout };
  request.get(streamUrl, options, (err, { body: html } = {}) => {
    if (err) {
      cb(err);
      return;
    }

    const $doc = minidom(html);
    const title = getTitle($doc).toLowerCase();
    const [ serverName ] = title.split(/\s+/g);

    let info;
    if (serverName === 'icecast') {
      info = parseIcecastPage($doc);
    } else if (serverName === 'shoutcast') {
      info = parseShoutcastPage($doc);
    } else {
      cb(new Error('Unsupported html received'));
      return;
    }

    info.url = streamUrl;
    cb(null, info);
  });
}

function getTitle($doc) {
  const $title = $doc.getElementsByTagName('title')[0];
  return $title ? $title.textContent.trim() : '';
}
