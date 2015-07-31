/**
 * @overview Wrapped pub/sub service client APIs (like Pusher)
 */
/* jshint
 funcscope: true,
 newcap: true,
 nonew: true,
 shadow: false,
 unused: true,

 maxlen: 90,
 maxparams: 3,
 maxstatements: 200
 */
/* global Pusher */
'use strict';

var PubSubChannel = require('./PubSubChannel');

/**
 * JavaScript interface for a publish/subscribe service provider.
 * @param {string} applicationKey
 * @interface
 */
var PubSubService = exports;

/**
 * @typedef {Object} PubSubConfig
 * @property {boolean} usePusher - Whether to use Pusher's API, or a null
 *           implementation.
 * @property {string} pusherApplicationKey - If using Pusher, the public key
 *           required to initialize the Pusher API.
 */

/**
 * Create an API instance appropriate to the current configuration.
 * @param {!PubSubConfig} pubSubConfig
 * @returns {PubSubService}
 */
PubSubService.create = function (pubSubConfig) {
  if (pubSubConfig.usePusher) {
    return new PubSubService.PusherService(pubSubConfig.pusherApplicationKey);
  }

  return new PubSubService.NullService();
};

/**
 * @function
 * @name PubSubService#subscribe
 * @param {string} channelID - Channel to which we subscribe.
 * @returns {PubSubChannel}
 */

/**
 * Stub implementation of PubSub API.
 * @constructor
 * @implements PubSubService
 */
PubSubService.NullService = function () { };

/**
 * @returns {PubSubChannel}
 */
PubSubService.NullService.prototype.subscribe = function () {
  return new PubSubChannel.NullChannel();
};

/**
 * Wrapped Pusher.com API.
 * @param {string} applicationKey
 * @constructor
 * @implements PubSubService
 */
PubSubService.PusherService = function (applicationKey) {
  /**
   * Instance of actual Pusher JavaScript API.
   * @type {Pusher}
   * @private
   */
  this.api_ = new Pusher(applicationKey, { encrypted: true });
};

/**
 * Subscribe to events on a particular channel.
 * @param {string} channelID
 * @returns {PubSubChannel}
 */
PubSubService.PusherService.prototype.subscribe = function (channelID) {
  return new PubSubChannel.PusherChannel(this.api_.subscribe(channelID));
};
