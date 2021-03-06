/* jshint node: true */

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'blog',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      ENABLE_DS_FILTER: true
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self'",
      'font-src': "'self'",
      'connect-src': "'self' https://api.cosmicjs.com",
      'img-src': "'self'",
      'style-src': "'self'",
      'media-src': "'self'"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.locationType = 'hash';
    ENV.BLOG_URL = 'https://api.cosmicjs.com/v1/blog-cb/object-type/dev-posts';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.locationType = 'hash';
    ENV.BLOG_URL = 'https://api.cosmicjs.com/v1/blog-cb/object-type/posts';
  }

  return ENV;
};
