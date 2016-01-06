/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {});
  var Funnel = require('broccoli-funnel');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('vendor/Museo_Slab_500_2-webfont.woff');
  app.import('vendor/Museo_Slab_500_2-webfont.woff2');
  app.import('bower_components/moment/moment.js');
  app.import('vendor/shims/moment.js');
  app.import('bower_components/fetch/fetch.js');

  var swAssets = new Funnel('service-workers', {
    srcDir: '/',
    include: ['**/*.js'],
    destDir: '/'
  });

  var swTAssets = new Funnel('bower_components/sw-toolbox', {
    srcDir: '/',
    include: ['sw-toolbox.js'],
    destDir: '/'
  });

  return app.toTree(new MergeTrees([swAssets, swTAssets]));
};
