(function (app) {
  'use strict';

  app.registerModule('idioms');
  app.registerModule('idioms.services');
  app.registerModule('idioms.routes', ['ui.router', 'idioms.services']);
})(ApplicationConfiguration);