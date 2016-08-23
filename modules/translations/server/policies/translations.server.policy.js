'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Translations Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/translations',
      permissions: '*'
    }, {
      resources: '/api/translations/:translationId',
      permissions: '*'
    }, {
      resources: '/api/getTranslationsByIdiom/:idiomId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/translations',
      permissions: ['get', 'post']
    }, {
      resources: '/api/translations/:translationId',
      permissions: '*'
    }, {
      resources: '/api/getTranslationsByIdiom/:idiomId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/translations',
      permissions: ['get']
    }, {
      resources: '/api/translations/:translationId',
      permissions: ['get']
    }, {
      resources: '/api/getTranslationsByIdiom/:idiomId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Translations Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.dataValues.roles : ['guest'];
  // If an translation is being processed and the current user created it then allow any manipulation
  if (req.translation && req.user && req.translation.User && req.translation.User.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};