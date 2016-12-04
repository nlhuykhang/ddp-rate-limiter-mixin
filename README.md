# ddp-rate-limiter-mixin

A mixin for [mdg:validated-method](https://github.com/meteor/validated-method) to add rate limitation support to Meteor's methods.

## Install

```bash
meteor add ddp-rate-limiter
npm install --save ddp-rate-limiter-mixin
```

## Usage

```javascript
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { RateLimiterMixin } from 'ddp-rate-limiter-mixin';

// limit the maximum 5 requests in 5 seconds to this method for every clients
const foo = new ValidatedMethod({
  name: 'foo',
  mixins: [RateLimiterMixin],
  rateLimit: {
    numRequests: 5,
    timeInterval: 5000,
  },
  validate: null,
  run() {
    // ...
  }
});

// limit the maximum 5 requests in 5 seconds to this method for user1 only
const boo = new ValidatedMethod({
  name: 'boo',
  mixins: [RateLimiterMixin],
  rateLimit: {
    matcher: {
      userId: 'user1',
    },
    numRequests: 5,
    timeInterval: 5000,
  },
  validate: null,
  run() {
    // ...
  }
});

// limit the maximum 5 requests in 5 seconds to this method for users who are not `Admin`
const bar = new ValidatedMethod({
  name: 'bar',
  mixins: [RateLimiterMixin],
  rateLimit: {
    // this use to match the request, optional
    matcher: {
      // optional, could be a string or a return-boolean function
      userId(userId) {
        return Meteor.users.findOne(userId).type !== 'Admin';
      },
      // optional, could be a string or a return-boolean function
      connectionId(connectionId) {
        return true;
      },
      // optional, could be a string or a return-boolean function
      clientAddress(clientAddress) {
        return true;
      },
    },
    numRequests: 5,
    timeInterval: 5000,
  },
  validate: null,
  run() {
    // ...
  }
});
```

## Rate Limit

This package uses Meteor's [DDPRateLimiter](https://docs.meteor.com/api/methods.html#ddpratelimiter) behind the scene to support rate limitation for Meteor methods. This comes with a nicer way to define rate limitation.

Using normal [DDPRateLimiter](https://docs.meteor.com/api/methods.html#ddpratelimiter) way is fine, but it would introduce 'side-effect' to your system. Like sometimes you just do not know where the limitation is set, or what is the maximum requests could be called in a period of time. This package helps solving that by specifying limitation when defining a method.

## rateLimit option

You have to specify the `rateLimit` option to define limitation.

`rateLimit.matcher` is optional. If specified it is similar to `matcher` 1st argument of [DDPRateLimiter.addRule](https://docs.meteor.com/api/methods.html#DDPRateLimiter-addRule), except `name` is always the name of method and `type` is always `method`.

```javascript
rateLimit: {
  // this use to match the request, optional
  matcher: {
    // optional, could be a string or a return-boolean function
    userId(userId) {
      // ...
      return true/false;
    },
    // optional, could be a string or a return-boolean function
    connectionId(connectionId) {
      return true/false;
    },
    // optional, could be a string or a return-boolean function
    clientAddress(clientAddress) {
      return true/false;
    },
  },
  // numRequests is the maximum number of  requests could be made in timeInterval (milliseconds)
  numRequests: 5,
  timeInterval: 5000, // 5000 milliseconds
},
```
