'use strict';

const request = require('request');
const minidom = require('minidom');
const { parseIcecastPage, parseShoutcastPage } = require('./parser.js');
const noop = Function.prototype;

const ua = 'Mozilla/5.0';
const timeout = 5000; // ms

module.exports = fetchStreamInfo;

function fetchStreamInfo(streamUrl, cb=noop) {
  let headers = { 'User-Agent': ua };
  request.get(streamUrl, { headers, timeout }, (err, { body: html }={}) => {
    if (err) {
      cb(err);
      return;
    }

    let $doc = minidom(html);
    let title = getTitle($doc).toLowerCase();
    let [ serverName ] = title.split(/\s+/g);

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
  return $doc.getElementsByTagName('title')[0].textContent.trim();
}
