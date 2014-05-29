/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;

var RequestMock = require('../mocks/request');
var ResponseMock = require('../mocks/response');

var Handler = require('../../lib/handler');
var NullCollector = require('../../lib/collectors/null');
var ConsoleCollector = require('../../lib/collectors/console');

describe('lib/handler', function () {
  var nullCollector1, nullCollector2, consoleCollector, handler;

  before(function () {
    nullCollector1 = new NullCollector();
    nullCollector2 = new NullCollector();
    consoleCollector = new ConsoleCollector({
      console: {
        log: function () {
          // drop the console messages on the ground for testing.
        }
      }
    });

    handler = new Handler({
      collectors: [ nullCollector1, nullCollector2, consoleCollector ]
    });
  });

  describe('handler', function () {
    var reqMock, respMock;

    it('returns json response of success', function () {
      reqMock = new RequestMock({
        url: '/metrics',
        method: 'POST'
      });
      respMock = new ResponseMock();

      handler(reqMock, respMock);

      assert.equal(respMock.status, 200);
      assert.isTrue(JSON.parse(respMock.body).success);
    });

    it('takes `user_agent`, `location` from headers, passes on data to collectors', function (done) {
      reqMock = new RequestMock({
        url: '/metrics',
        method: 'POST',
        data: { events: [ { type: 'done' } ] },
        headers: {
          'user-agent': 'a user agent',
          'referrer': 'site the request comes from'
        }
      });
      respMock = new ResponseMock();

      var collector1Event;
      nullCollector1.on('data', function (event) {
        collector1Event = event;
      });

      nullCollector2.on('data', function (event) {
        assert.ok(collector1Event);
        assert.ok(event);

        assert.equal(event.user_agent, 'a user agent');
        assert.equal(event.location, 'site the request comes from');

        done();
      });

      handler(reqMock, respMock);
    });
  });
});
