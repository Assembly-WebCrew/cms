(function () {
  'use strict';

  var COUNTDONW_LOCALES = {
    en: {
      units: ['months', 'days', 'hours', 'minutes', 'seconds'],
      until: 'until ASSEMBLY!',
      left: 'of ASSEMBLY left!',
      over: 'ASSEMBLY is over.'
    },
    fi: {
      units: ['kuukautta', 'päivää', 'tuntia', 'minuuttia', 'sekuntia'],
      until: 'ASSEMBLYihin!',
      left: 'ASSEMBLYA jäljellä!',
      over: 'ASSEMBLY on ohi.'
    }
  };

  function Countdown($interval) {
    this.parts = ['months', 'days', 'hours', 'minutes'];
    this.locale = COUNTDONW_LOCALES[DJANGO.currentLanguage];

    $interval(angular.bind(this, this.update), 1000 * 60);
    this.update();
  }

  Countdown.prototype.update = function () {
    this.startDiff = moment(this.startDate).diff();
    this.endDiff = moment(this.endDate).diff(moment());
    this.duration = moment.duration(this.startDiff > 0 ? this.startDiff : this.endDiff, 'ms');
  };

  angular.module('asmApp').directive('asmCountdown', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: DJANGO.staticPath + 'components/countdown/countdown.html',
      scope: {},
      controller: Countdown,
      controllerAs: 'cd',
      bindToController: {
        'startDate': '@',
        'endDate': '@'
      }
    };
  });

})();