import { RateLimiterMixin } from 'ddp-rate-limiter-mixin';

// console.log('test file');
// console.log(ValidatedMethod);
// console.log(RateLimiterMixin);

const foo = new ValidatedMethod({
  name: 'foo',
  mixins: [RateLimiterMixin],
  rateLimit: {
    // matcher: {
    //   userId: 34
    // },
    numRequests: 1,
    timeInterval: 5000,
  },
  validate: null,
  run() {
    console.log('test2');
  }
});
