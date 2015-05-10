(function () {
  'use strict';

  angular.module('asmApp').directive('asmCountdown', function () {
    return {
      restrict: 'E',
      templateUrl: DJANGO.staticPath + 'components/countdown/countdown.html',
      scope: {}
    };
  });

})();