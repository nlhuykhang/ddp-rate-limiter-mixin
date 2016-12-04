import { Meteor } from 'meteor/meteor';
import { RateLimiterMixin } from 'ddp-rate-limiter-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  test() {
    console.log('test');
    return;
  },
});

const foo = new ValidatedMethod({
  name: 'foo',
  mixins: [RateLimiterMixin],
  rateLimit: {
    // matcher: {
    //   userId: 34
    // },
    numRequests: 5,
    timeInterval: 5000,
  },
  validate: null,
  run() {
    console.log('test2');
  }
});
