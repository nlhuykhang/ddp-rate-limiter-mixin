/* global DDPRateLimiter, Meteor */
/* eslint import/prefer-default-export: 0 */

const isOptionalStringOrFunction =
  val => typeof val === 'string' || typeof val === 'function' || typeof val === 'undefined';

const isOptionalObject = val => typeof val === 'object' || typeof val === 'undefined';

const isOptionalFunction = val => typeof val === 'function' || typeof val === 'undefined';

const alwaysTrue = () => true;

const RateLimiterMixin = (methodOptions) => {
  if (Meteor.isClient) {
    return methodOptions;
  }

  const {
    name,
    rateLimit,
  } = methodOptions;

  if (!rateLimit) {
    throw new Error(`RateLimiterMixin: rateLimit option is missing (${name} method)`);
  }

  const {
    matcher,
    numRequests,
    timeInterval,
    callback,
  } = rateLimit;

  if (typeof numRequests !== 'number') {
    throw new Error(`RateLimiterMixin: numRequests must be a number (${name} method)`);
  }

  if (typeof timeInterval !== 'number') {
    throw new Error(`RateLimiterMixin: timeInterval must be a number (${name} method)`);
  }

  if (!isOptionalObject(matcher)) {
    throw new Error(`RateLimiterMixin: matcher must be an object if specified (${name} method)`);
  }

  if (!isOptionalFunction(callback)) {
    throw new Error(`RateLimiterMixin: callback must be a function if specified (${name} method)`);
  }

  const {
    userId = alwaysTrue,
    connectionId = alwaysTrue,
    clientAddress = alwaysTrue,
  } = matcher || {};

  if (!isOptionalStringOrFunction(userId)) {
    throw new Error(`RateLimiterMixin: matcher.userId must be a string or a function if specified (${name} method)`);
  }

  if (!isOptionalStringOrFunction(connectionId)) {
    throw new Error(`RateLimiterMixin: matcher.connectionId must be a string or a function if specified (${name} method)`);
  }

  if (!isOptionalStringOrFunction(clientAddress)) {
    throw new Error(`RateLimiterMixin: matcher.clientAddress must be a string or a function if specified (${name} method)`);
  }

  DDPRateLimiter.addRule({
    type: 'method',
    name,
    userId,
    connectionId,
    clientAddress,
  }, numRequests, timeInterval, callback);

  return methodOptions;
};

export { RateLimiterMixin };
