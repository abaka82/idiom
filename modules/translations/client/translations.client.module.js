(function (app) {
  'use strict';

  app.registerModule('translations');
  app.registerModule('translations.services');
  app.registerModule('translations.routes', ['ui.router', 'translations.services']);
})(ApplicationConfiguration);