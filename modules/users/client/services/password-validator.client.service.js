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
