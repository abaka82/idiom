'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Equivalents Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/equivalents',
      permissions: '*'
    }, {
      resources: '/api/equivalents/:equivalentId',
      permissions: '*'
    }, {
      resources: '/api/getEquivalentsByIdiom/:idiomId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/equivalents',
      permissions: ['get', 'post']
    }, {
      resources: '/api/equivalents/:equivalentId',
      permissions: '*'
    }, {
      resources: '/api/getEquivalentsByIdiom/:idiomId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/equivalents',
      permissions: ['get']
    }, {
      resources: '/api/equivalents/:equivalentId',
      permissions: ['get']
    }, {
      resources: '/api/getEquivalentsByIdiom/:idiomId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Equivalents Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.dataValues.roles : ['guest'];
  // If an equivalent is being processed and the current user created it then allow any manipulation
  if (req.equivalent && req.user && req.equivalent.User && req.equivalent.User.id === req.user.id) {
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