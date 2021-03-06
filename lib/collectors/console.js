/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// A console collector - ship results to the console.

'use strict';

function ConsoleCollector(options) {
  options = options || {};
  this.console = options.console || console;
}

ConsoleCollector.prototype = {
  destroy: function destroy() {
    // nothing to do here.
    this.console.log('destroy');
  },

  /**
   * Store a result
   */
  write: function write(data) {
    this.console.log('write: %s', JSON.stringify(data, null, 2));
  },

  /**
   * Flush the cache
   */
  flush: function flush() {
    this.console.log('flush');
  }
};

module.exports = ConsoleCollector;
