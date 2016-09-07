'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = [
    'ngResource',
    'ngAnimate',
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'angularFileUpload',
    'ngTable',
    'toastr',
    'ngBootbox'
  ];

  // Add a new vertical module
  var registerModule = function(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || [
      'angularMoment',
      'angular-capitalize-filter',
      'ngSanitize'
    ]).constant('_', window._);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if ((role === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1)) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('equivalents');
  app.registerModule('equivalents.services');
})(ApplicationConfiguration);
(function (app) {
  'use strict';

  app.registerModule('idioms');
  app.registerModule('idioms.services');
  app.registerModule('idioms.routes', ['ui.router', 'idioms.services']);
})(ApplicationConfiguration);
(function (app) {
  'use strict';

  app.registerModule('translations');
  app.registerModule('translations.services');
})(ApplicationConfiguration);
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Starting state routing
    $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
    })
    // Home state routing
    .state('home', {
      url: '/home',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

angular.module('core').directive('customConfirmation', ['$modal',
  function($modal) {

    var ModalInstanceCtrl = function($scope, $modalInstance) {
      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    };
    ModalInstanceCtrl.$inject = ["$scope", "$modalInstance"];

    return {
      restrict: 'A',
      scope: {
        customConfirmation: '&'
      },
      link: function(scope, element, attrs) {
        element.bind('click', function() {
          var message = attrs.customMessage || 'Are you sure?';

          //var modalHtml;
          var modalHtml = '<div class="modal-header"><h4 class="modal-title">Confirmation</h4></div>';
          modalHtml += '<div class="modal-body">' + message + '</div>';
          modalHtml += '<div class="modal-footer"><button class="btn btn-success" ng-click="ok()">Yes</button><button class="btn btn-danger" ng-click="cancel()">No</button></div>';

          var modalInstance = $modal.open({
            template: modalHtml,
            controller: ModalInstanceCtrl
          });

          modalInstance.result.then(function() {
            scope.customConfirmation();
          }, function() {
            //Modal dismissed
          });

        });
      }
    };
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
  function ($q, $injector, Authentication) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

(function() {
  'use strict';

  angular
    .module('equivalents.services')
    .factory('EquivalentsService', EquivalentsService)
    .factory('EquivalentsByIdiomService', EquivalentsByIdiomService);

  EquivalentsService.$inject = ['$resource'];
  EquivalentsByIdiomService.$inject = ['$resource'];

  function EquivalentsService($resource) {
    return $resource('api/equivalents/:equivalentId', {
      equivalentId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      get : {
        method: 'GET',
        isArray: true
      }
    });
  }

  function EquivalentsByIdiomService($resource) {
    return $resource('api/getEquivalentsByIdiom/:idiomId', {
      idiomId: '@idiomId'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      get : {
        method: 'GET',
        isArray: true
      }
    });
  }
})();
(function() {
  'use strict';

  angular
    .module('idioms')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Idioms',
      state: 'idioms',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'idioms', {
      title: 'List Idioms',
      state: 'idioms.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'idioms', {
      title: 'Create Idiom',
      state: 'idioms.create',
      roles: ['user', 'admin']
    });
  }
})();
(function() {
  'use strict';

  angular
    .module('idioms.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('idioms', {
        abstract: true,
        url: '/idioms',
        template: '<ui-view/>'
      })
      .state('idioms.list', {
        url: '',
        templateUrl: 'modules/idioms/client/views/list-idioms.client.view.html',
        controller: 'IdiomsListController',
        controllerAs: 'vm'
      })
      .state('idioms.create', {
        url: '/create',
        templateUrl: 'modules/idioms/client/views/form-idiom.client.view.html',
        controller: 'IdiomsController',
        controllerAs: 'vm',
        resolve: {
          idiomResolve: newIdiom,
          newTranslationResolve: newTranslation,
          newEquivalentResolve: newEquivalent,
          getTranslationResolve: getTranslation,
          getEquivalentResolve: getEquivalent
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('idioms.edit', {
        url: '/:idiomId/edit',
        templateUrl: 'modules/idioms/client/views/form-idiom.client.view.html',
        controller: 'IdiomsController',
        controllerAs: 'vm',
        resolve: {
          idiomResolve: getIdiom,
          newTranslationResolve: newTranslation,
          newEquivalentResolve: newEquivalent,
          getTranslationResolve: getTranslation,
          getEquivalentResolve: getEquivalent
        },
        data: {
          roles: ['user', 'admin']
        }
      });
  }

  getIdiom.$inject = ['$stateParams', 'IdiomsService'];

  function getIdiom($stateParams, IdiomsService) {
    return IdiomsService.get({
      idiomId: $stateParams.idiomId
    }).$promise;
  }

  getTranslation.$inject = ['$stateParams', 'TranslationsService', 'TranslationsByIdiomService'];

  function getTranslation($stateParams, TranslationsService, TranslationsByIdiomService) {
    if (!$stateParams.idiomId) {
      return new TranslationsService();
    } else {
      return TranslationsByIdiomService.query({
        idiomId: $stateParams.idiomId
      }).$promise;
    }
  }

  getEquivalent.$inject = ['$stateParams', 'EquivalentsService', 'EquivalentsByIdiomService'];

  function getEquivalent($stateParams, EquivalentsService, EquivalentsByIdiomService) {
    if (!$stateParams.idiomId) {
      return new EquivalentsService();
    } else {
      return EquivalentsByIdiomService.query({
        idiomId: $stateParams.idiomId
      }).$promise;
    }
  }

  newIdiom.$inject = ['IdiomsService'];

  function newIdiom(IdiomsService) {
    return new IdiomsService();
  }

  newTranslation.$inject = ['TranslationsService'];

  function newTranslation(TranslationsService) {
    return new TranslationsService();
  }

  newEquivalent.$inject = ['EquivalentsService'];

  function newEquivalent(EquivalentsService) {
    return new EquivalentsService();
  }
})();
(function() {
  'use strict';

  angular
    .module('idioms')
    .controller('IdiomsController', IdiomsController);

  IdiomsController.$inject = ['$http', '$scope', '$timeout', '$window', '$state',
                              'idiomResolve', 'newTranslationResolve', 'newEquivalentResolve',
                              'getTranslationResolve', 'getEquivalentResolve',
                              'Authentication', 'FileUploader', 'toastr',
                              'TranslationsService', 'TranslationsByIdiomService',
                              'EquivalentsService', 'EquivalentsByIdiomService'];

  function IdiomsController($http, $scope, $timeout, $window, $state,
                            idiom, translation, equivalent,
                            getTranslationResolve, getEquivalentResolve,
                            Authentication, FileUploader, toastr,
                            TranslationsService, TranslationsByIdiomService,
                            EquivalentsService, EquivalentsByIdiomService) {
    var vm = this;

    vm.idiom = idiom;
    vm.translation = translation;
    vm.equivalent = equivalent;
    vm.authentication = Authentication;
    vm.error = null;
    vm.errorEquivalent = null;
    vm.errorTranslation = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveTranslation = saveTranslation;
    vm.saveEquivalent = saveEquivalent;
    vm.translationRequired = false;
    vm.equivalentRequired = false;

    console.log('getTranslation: '+JSON.stringify(getTranslationResolve));
    console.log('getEquivalent: '+JSON.stringify(getEquivalentResolve));

    vm.translationsByIdiom = getTranslationResolve;
    vm.equivalentsByIdiom = getEquivalentResolve;

    vm.languages = [
      { id: '1', lang: 'DE' },
      { id: '2', lang: 'EN' },
      { id: '3', lang: 'ES' },
      { id: '4', lang: 'IT' }];

    //Set default value of combobox in the ui
    vm.selectedLang = { id: '1', lang: 'DE' };
    vm.selectedTranslationLang = { id: '2', lang: 'EN' };
    vm.selectedEquivalentLang = { id: '2', lang: 'EN' };

    // custom dialog for New Idiom button
    vm.customDialogButtonsNewIdiom = {
      save: {
        label: 'Save',
        className: 'btn-warning',
        callback: function() { 
          console.log('Save action');
          save(vm.form.idiomForm.$valid);
          $state.go('idioms.create');
        }
      },
      discard: {
        label: 'Discard changes',
        className: 'btn-danger',
        callback: function() {
          console.log('Discard changes action');
          $state.go('idioms.create');
        }
      },
      cancel: {
        label: 'Cancel',
        className: 'btn-primary',
        callback: function() {
          console.log('Cancel action');
        }
      }
    };

    // custom dialog for Cancel button
    vm.customDialogButtonsCancel = {
      save: {
        label: 'Save',
        className: 'btn-warning',
        callback: function() { 
          console.log('Save action');
          save(vm.form.idiomForm.$valid);
          $state.go('home');
        }
      },
      discard: {
        label: 'Discard changes',
        className: 'btn-danger',
        callback: function() {
          console.log('Discard changes action');
          $state.go('home');
        }
      },
      cancel: {
        label: 'Cancel',
        className: 'btn-primary',
        callback: function() {
          console.log('Cancel action');
        }
      }
    };

    // Remove existing Idiom
    function remove() {
      vm.idiom.$remove($state.go('idioms.create'));
      toastr.success('Idiom has been deleted successfully');
    }

    $scope.remove = function() {
      remove();
    };

    // Save Idiom
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.idiomForm');
        return false;
      }

      vm.idiom.language = vm.selectedLang.lang;
      var operation = '';

      // TODO: move create/update logic to service
      if (vm.idiom.id) {
        operation = 'update';
        vm.idiom.$update(successCallback, errorCallback);
      } else {
        operation = 'add';
        vm.idiom.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (operation === 'add') {
          console.log('success add idiom with id: '+res.id);
          toastr.success('New idiom has been added successfully. Please continue to add image, 121 translation, and its equivalent.');
        } else {
          console.log('success update idiom id: '+res.id);
          toastr.success('Idiom has been updated successfully.');
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        toastr.error(res.data.message, 'There is an error');
      }
    }

    // --------Start Image functions ------------
    if (!vm.idiom.imageURL) {
      vm.imageURL = 'modules/idioms/client/img/no-image.png';
    } else {
      vm.imageURL = vm.idiom.imageURL;
    }

    // Create file uploader instance
    vm.uploader = new FileUploader({
      url: 'api/idioms/picture',
      alias: 'newPicture'
    });

    // Set file uploader image filter
    vm.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    vm.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      vm.success = true;

      // Clear upload buttons
      vm.uploader.clearQueue();
      toastr.success('Idiom picture changed successfully');
    };

    // Called after the user has failed to uploaded a new picture
    vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      vm.cancelUpload();

      // Show error message
      vm.error = response.message;
      toastr.error(response.message, 'There is an error');
    };

    // Change idiom picture
    vm.uploadPicture = function () {
      // Clear messages
      vm.success = $scope.error = null;

      vm.uploader.queue[0].formData.push({
        idiomId: vm.idiom.id
      });

      // Start upload
      vm.uploader.uploadAll();
    };

    // Cancel the upload process
    vm.cancelUpload = function () {
      vm.uploader.clearQueue();

      if (!vm.idiom.imageURL) {
        vm.imageURL = 'modules/idioms/client/img/no-image.png';
      } else {
        vm.imageURL = vm.idiom.imageURL;
      }
    };

    // --------End Image functions ------------


    // --------Start 121 Translations functions ------------

    // get all translation based on idiom id
    function getTranslation() {
      TranslationsByIdiomService.query({ idiomId : vm.idiom.id })
      .$promise.then(function (res) {
        vm.translationsByIdiom = res;
      }, function(res) {
        vm.errorTranslation = res.data.message;
      });
    }

    // Save 121 Translations
    function saveTranslation(isValid) {

      // check 121 translation blank or not
      if (!vm.translation.translation) {
        vm.translationRequired = true;
        return false;
      }

      vm.translation.language = vm.selectedTranslationLang.lang;
      vm.translation.idiomId = vm.idiom.id;

      vm.translation.$save(successCallback, errorCallback);

      function successCallback(res) {
        console.log('success add 121 translation with id: '+res.id);

        //clear id and prepare for new translation
        vm.translation.id = '';
        vm.translationRequired = false;

        // refresh translation list
        getTranslation();
      }

      function errorCallback(res) {
        vm.errorTranslation = res.data.message;
      }
    }

    // Delete 121 Translations
    function removeTranslation(translationId) {

      TranslationsService.delete({ translationId : translationId })
      .$promise.then(function (res) {
        console.log('success delete 121 Translations');

        // refresh translation list
        getTranslation();
      }, function(res) {
        console.log('error delete 121 Translations');
        vm.errorTranslation = res.data.message;
      });
    }

    $scope.removeTranslation = function(translationId) {
      removeTranslation(translationId);
    };

    // --------End 121 Translations functions ------------


    // --------Start Equivalent Translations functions ------------

    // get all equivalent translation based on idiom id
    function getEquivalent() {
      EquivalentsByIdiomService.query({ idiomId : vm.idiom.id })
      .$promise.then(function (res) {
        vm.equivalentsByIdiom = res;
      }, function(res) {
        vm.errorEquivalent = res.data.message;
      });
    }

    // Save Equivalent Translations
    function saveEquivalent(isValid) {

      // check Equivalent translation blank or not
      if (!vm.equivalent.equiv_idiom) {
        vm.equivalentRequired = true;
        return false;
      }

      vm.equivalent.language = vm.selectedEquivalentLang.lang;
      vm.equivalent.idiomId = vm.idiom.id;

      vm.equivalent.$save(successCallback, errorCallback);

      function successCallback(res) {
        console.log('success add equivalent translation with id: ' + res.id);

        //clear id and prepare for new equivalent translation
        vm.equivalent.id = '';
        vm.equivalentRequired = false;

        // refresh equivalent translation list
        getEquivalent();
      }

      function errorCallback(res) {
        vm.errorEquivalent = res.data.message;
      }
    }

    // Delete Equivalent Translations
    function removeEquivalent(equivalentId) {

      EquivalentsService.delete({ equivalentId : equivalentId })
      .$promise.then(function (res) {
        console.log('success delete equivalent Translations');

        // refresh equivalent translation list
        getEquivalent();
      }, function(res) {
        console.log('error delete equivalent Translations');
        vm.errorEquivalent = res.data.message;
      });
    }

    $scope.removeEquivalent = function(equivalentId) {
      removeEquivalent(equivalentId);
    };

    // --------End EquivalentId Translations functions ------------

  }
})();
  'use strict';

  angular
  .module('idioms')
  .controller('IdiomsListController', ["$scope", "$filter", "$state", "toastr", "IdiomsService", "NgTableParams", function ($scope, $filter, $state, toastr, IdiomsService, NgTableParams) {
    var vm = this;

    var orderBy = $filter('orderBy');
    vm.searchKeyword = { idiom: '', language: '' };

    vm.languages = [
      { id: '1', lang: 'DE' },
      { id: '2', lang: 'EN' },
      { id: '3', lang: 'ES' },
      { id: '4', lang: 'IT' },
      { id: '5', lang: '' }];

    //Set default value of combobox in the ui
    vm.selectedLang = { id: '5', lang: '' };

    vm.changeLang = function() {
      vm.searchKeyword.language = vm.selectedLang.lang;
    };

    vm.clearSearch = function() {
      vm.searchKeyword.idiom='';
      vm.selectedLang = { id: '5', lang: '' };
      vm.searchKeyword.language = vm.selectedLang.lang;
    };

    function remove(id) {
      IdiomsService.delete({ idiomId : id })
      .$promise.then(function (res) {
        console.log('success delete idiom id: '+ id);
        toastr.success('Idiom has been deleted successfully');
        $state.reload();
      }, function(res) {
        console.log('error delete idiom id: '+ id);
        toastr.error(res.data.message, 'There is an error');
        vm.errorTranslation = res.data.message;
      });
    }

    $scope.remove = function(id) {
      remove(id);
    };

    vm.order = function(predicate) {
      vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
      vm.predicate = predicate;
    };


    vm.listIdiomTable = new NgTableParams({
      page: 1,
      count: 10,  //items per page
      filter: vm.searchKeyword
    }, {
      total: 0, // length of data
      getData: function ($defer, params) {
        IdiomsService.query({}, function(response) {
          vm.idioms = response;

          if (params.filter().idiom || params.filter().language) {
            vm.data = $filter('filter')(vm.idioms, params.filter());
            console.log('==params.filter()======='+JSON.stringify(params.filter()));
            params.total(vm.data.length); 
          } else {
            vm.data = vm.idioms.slice((params.page() - 1) * params.count(), params.page() * params.count());
            params.total(vm.idioms.length); 
          }

          // set total for recalc pagination
          $defer.resolve(vm.data);
        });
      }
    });
  }]);


(function() {
  'use strict';

  angular
    .module('idioms.services')
    .factory('IdiomsService', IdiomsService);

  IdiomsService.$inject = ['$resource'];

  function IdiomsService($resource) {
    return $resource('api/idioms/:idiomId', {
      idiomId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
(function() {
  'use strict';

  angular
    .module('translations.services')
    .factory('TranslationsService', TranslationsService)
    .factory('TranslationsByIdiomService', TranslationsByIdiomService);

  TranslationsService.$inject = ['$resource'];
  TranslationsByIdiomService.$inject = ['$resource'];

  function TranslationsService($resource) {
    return $resource('api/translations/:translationId', {
      translationId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      get : {
        method: 'GET',
        isArray: true
      }
    });
  }

  function TranslationsByIdiomService($resource) {
    return $resource('api/getTranslationsByIdiom/:idiomId', {
      idiomId: '@idiomId'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      get : {
        method: 'GET',
        isArray: true
      }
    });
  }
})();
'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Register New User',
      state: 'authentication.signup'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/users.client.view.html'
      });
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users').controller('RolesController', [
  'Authentication',

  '$http',
  '$location',
  '$modalInstance',
  '$rootScope',
  '$scope',

  '_',
  'user',

  function(
    Authentication,

    $http,
    $location,
    $modalInstance,
    $rootScope,
    $scope,

    _,
    user
  ) {
    $scope.user = user;

    /**
     * Dismiss
     */
    $scope.dismiss = function() {
      $modalInstance.dismiss(true);
    };

    /**
     * Get roles
     * @return {[type]} [description]
     */
    $scope.getRoles = function() {
      $http({
        url: 'api/users/roles',
        method: 'GET'
      })
      .success(function(data) {
        console.log(data);
        $scope.roles = data;
      });
    };

    /**
     * Is checked
     * @param roleId
     * @returns {boolean}
     */
    $scope.isChecked = function(roleId) {
      var rolesArray = [];

      _.each(user.Roles, function(Role) {
        rolesArray.push(Role.id);
      });

      if (rolesArray.indexOf(roleId) !== -1) {
        return true;
      }
    };

    /**
     * Update
     * @param roleId
     */
    $scope.update = function(roleId) {
      var rolesArray = [];

      _.each(user.Roles, function(Role) {
        rolesArray.push(Role.id);
      });

      if (rolesArray.indexOf(roleId) === -1) {
        rolesArray.push(roleId);

      } else {
        var index = rolesArray.indexOf(roleId);
        rolesArray.splice(index, 1);
      }

      var params = {
        roles: rolesArray
      };

      $http({
        url: 'api/users/admin/' + user.id,
        method: 'PUT',
        params: params
      })
      .success(function(data) {
        $rootScope.$emit('rolesUpdate');
        user = data;
      });
    };
    
    /**
     * Init
     * @return {[type]} [description]
     */
    $scope.init = function() {
      $scope.getRoles();
    };
  }
]);

'use strict';

angular.module('users').controller('UsersController', [
  'Authentication',
  'Users',

  'moment',
  '_',

  '$http',
  '$rootScope',
  '$scope',
  '$stateParams',
  '$location',
  '$modal',

  function(Authentication,
    Users,
    moment,
    _,
    $http,
    $rootScope,
    $scope,
    $stateParams,
    $location,
    $modal) {
    $scope.authentication = Authentication;

    // Authentication check
    if (!$scope.authentication.user) {
      $location.path('/authentication/signin');
    } else {
      var roles = $scope.authentication.user.roles;

      if (_.includes(roles, 'admin')) {
        $scope.authenticated = true;
      } else {
        $location.path('/');
      }
    }

    /**
     * Find users
     */
    $scope.find = function() {
      var limit = $scope.pageSize;
      var offset = ($scope.currentPage - 1) * $scope.pageSize;
      var search = $scope.search;

      var params = {
        'limit': limit,
        'offset': offset,
        'search': search
      };

      $http({
        url: 'api/users/admin',
        method: 'GET',
        params: params
      }).success(function(data) {
        $scope.totalItems = data.count;
        $scope.users = data.rows;

        $scope.numberOfPages = Math.ceil($scope.totalItems / $scope.pageSize);

        if ($scope.numberOfPages !== 0 && $scope.currentPage > $scope.numberOfPages) {
          $scope.currentPage = $scope.numberOfPages;
        }

        var beginning = $scope.pageSize * $scope.currentPage - $scope.pageSize;
        var end = (($scope.pageSize * $scope.currentPage) > $scope.totalItems) ? $scope.totalItems : ($scope.pageSize * $scope.currentPage);

        $scope.pageRange = beginning + ' ~ ' + end;
      });
    };

    /**
     * Remove user
     * @param article
     */
    $scope.remove = function(user) {
      console.log(user);

      if (user) {

        $http({
          url: 'api/users/admin/' + user.id,
          method: 'DELETE'
        }).success(function(data) {
          console.log(data);
        });

        for (var i in $scope.users) {
          if ($scope.users[i] === user) {
            $scope.users.splice(i, 1);
          }
        }
      } else {
        $scope.user.$remove(function() {
          $location.path('users');
        });
      }
    };

    /**
     * Search controls
     */

    $scope.changeSearch = function() {
      $scope.userForm.$setPristine();

      $scope.find();
    };

    /**
     * Pagination Controls
     */

    $scope.pageSizes = [1, 5, 10];
    $scope.currentPage = 1;

    $scope.pageSize = $scope.pageSizes[1];

    $scope.changePage = function() {
      if (!angular.isNumber($scope.currentPage)) {
        $scope.currentPage = 1;
      }

      if ($scope.currentPage === '') {
        $scope.currentPage = 1;
      } else if ($scope.currentPage > $scope.numberOfPages) {
        $scope.currentPage = $scope.numberOfPages;
      }

      $scope.paginationForm.$setPristine();
      $scope.find();
    };

    $scope.changeSize = function() {
      $scope.paginationForm.$setPristine();

      $scope.currentPage = 1;

      $scope.find();
    };

    $scope.clickFastBackward = function() {
      if ($scope.currentPage !== 1) {
        $scope.currentPage = 1;
        $scope.find();
      }
    };

    $scope.clickBackward = function() {
      if ($scope.currentPage !== 1) {
        $scope.currentPage--;
        $scope.find();
      }
    };

    $scope.clickForward = function() {
      if ($scope.currentPage !== $scope.numberOfPages && $scope.numberOfPages !== 0) {
        $scope.currentPage++;
        $scope.find();
      }
    };

    $scope.clickFastForward = function() {
      if ($scope.currentPage !== $scope.numberOfPages && $scope.numberOfPages !== 0) {
        $scope.currentPage = $scope.numberOfPages;
        $scope.find();
      }
    };

    /**
     * Init
     */
    $scope.init = function() {
      if ($scope.authenticated) {
        $scope.find();
      }
    };

    /*
     * Modal
     */

    /**
     * Open roles modal
     * @param index
     * @param size
     */
    $scope.openRolesModal = function(index, size) {
      var user = $scope.users[index];

      var modalInstance = $modal.open({
        templateUrl: 'roles-modal.html',
        controller: 'RolesController',
        size: size,
        resolve: {
          user: function() {
            return user;
          }
        }
      });
    };

    $rootScope.$on('rolesUpdate', function(event) {
      $scope.init();
    });
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'toastr', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, toastr, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful, do not assign the response to the global user model
        //$scope.authentication.user = response;

        // And redirect to home page
        $state.go('home');
        toastr.success('New user has been created successfully.');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        owaspPasswordStrengthTest.config({
          allowPassphrases       : false,
          maxLength              : 128,
          minLength              : 4,
          minPhraseLength        : 4,
          minOptionalTestsToPass : 1
        });

        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 4 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
