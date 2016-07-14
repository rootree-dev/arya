/*
 * Arya - script for client session tracking
 *
 * namings 
 *
 * needle: unique id per client
 * sst: session start time
 * slt: session last time
 */
(function (name, window, fn) {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) { module.exports = fn(); }
  else if (typeof define === 'function' && define.amd) { define(fn); }
  else { window[name] = fn(); }
})('Arya', this, function() {
  'use strict';
  var VERSION = '0.0.1';
  /*
   * default variables
   */
  // session expires in 30 minute
  var config = {
    session_duration: 30 * 60 * 1000
  };

  /*
   * arya functions
   */
  var arya = function() {
    this.init();
  };

  arya.prototype = {
    wallet: {},

    now: function() {
      return (new Date()).getTime();
    },

    uuid: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },

    isUnsafe: function() {
      if ( localStorage === undefined ) {
        return true;
      }
    },

    version: function() {
      return VERSION;
    },

    init: function() {
      if ( this.isUnsafe() === true ) {
        return null;
      }

      // needle
      this.needle();
      this.wallet['needle'] = localStorage['ar_ndl'];

      // session
      if ( this.isSessionExpired() === true ) {
        this.renewSession();
      }

      this.wallet['session.start'] = parseInt(localStorage['ar_sst']);
      localStorage['ar_slt'] = this.wallet['session.now'] = this.now();

      // referrer
      this.wallet['referrer'] = document.referrer;

      // language
      var lang_info = (this._try(navigator.languages, 0) || navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || '').split('-');
      var language, country;

      language = this._try(lang_info, 0);
      country = this._try(lang_info, 1);

      this.wallet['language'] = language.toLowerCase();
      this.wallet['country'] = country.toLowerCase();

      // viewport
      this.wallet['viewport.width'] = window.innerWidth;
      this.wallet['viewport.height'] = window.innerHeight;

      // screen
      this.wallet['screen.width'] = window.screen.width;
      this.wallet['screen.height'] = window.screen.height;

      // content
      this.wallet['title'] = document.title;
      this.wallet['url'] = window.location.href;
    },

    isSessionExpired: function() {
      if( localStorage['ar_slt'] !== undefined && this.now() - (new Date(parseInt(localStorage['ar_slt'])).getTime()) < config.session_duration || this.now() - (new Date(parseInt(localStorage['ar_slt'])).getTime()) < 0 ) {
        return false;
      }
      return true;
    },

    needle: function() {
      if ( localStorage['ar_ndl'] === undefined ) {
        localStorage['ar_ndl'] = this.uuid();
      }
    },

    renewSession: function() {
      localStorage['ar_sst'] = this.now();
    },

    _try: function(obj, key) {
      try {
        return obj[key];
      }
      catch(e) {
        return null;
      }
    }
  };

  return arya;
});
