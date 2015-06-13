(function () {
  'use strict';

  var LOCALE = {
    en: {
      ends: 'ends',
      original: 'originally scheduled'
    },
    fi: {
      ends: 'päättyy',
      original: 'piti alkaa'
    }
  };

  function Schedule($http, $anchorScroll, $location) {
    var vm = this;

    vm.$location = $location;
    vm.locale = LOCALE[DJANGO.currentLanguage];
    vm.fieldSuffix = DJANGO.currentLanguage === 'en' ? '' : '_fi';

    $http.get(this.source).success(function (data) {
      vm.locations = _.mapValues(data.locations, vm.formatLocation.bind(vm));
      vm.processEvents(data.events);

      var current = $location.hash();

      if (current) {
        _.find(vm.events, 'id', current).isSelected = true;
        setTimeout($anchorScroll); // Scroll to selected event.
      }

    });
  }

  Schedule.prototype.select = function (event) {
    this.events.forEach(function (event) {
      event.isSelected = false;
    });
    event.isSelected = true;
    this.$location.hash(event.id);
  };

  Schedule.prototype.processEvents = function (events) {
    var vm = this;
    vm.events = events.map(vm.formatEvent.bind(vm));

    // Figure out event flags.
    vm.flags = _(vm.events).pluck('flags').flatten().uniq().valueOf();
    vm.eventsByFlag = {};
    vm.flags.forEach(function (flag) {
      vm.eventsByFlag[flag] = vm.events.filter(function (event) {
        return event.flags.indexOf(flag) === -1;
      });
    });

    // Figure out event days.
    vm.days = _(vm.events).pluck('startTime').invoke('format', 'dddd').uniq().valueOf();
    vm.eventsByDay = {};
    vm.days.forEach(function (day) {
      vm.eventsByDay[day] = vm.events.filter(function (event) {
        return event.startTime.format('dddd') === day;
      });
    });

    // Figure out delayed events.
    vm.rescheduledEvents = vm.events.filter(function (event) {
      return !event.startTime.isSame(event.originalStartTime);
    });
  };

  Schedule.prototype.formatEvent = function (event) {
    return {
      id: event.key,
      name: event['name' + this.fieldSuffix],
      url: event.url,
      flags: event.flags,
      categories: event.categories,
      location: this.locations[event.location_key],
      startTime: moment(event.start_time, moment.ISO_8601),
      originalStartTime: moment(event.original_start_time, moment.ISO_8601),
      endTime: moment(event.end_time, moment.ISO_8601),
      isRescheduled: !moment(event.start_time, moment.ISO_8601)
        .isSame(moment(event.original_start_time, moment.ISO_8601))
    };
  };

  Schedule.prototype.formatLocation = function (location) {
    return {
      name: location['name' + this.fieldSuffix],
      url: location.url
    };
  };

  angular.module('asmApp').directive('asmSchedule', function () {
    return {
      restrict: 'E',
      templateUrl: DJANGO.staticPath + 'components/schedule/schedule.html',
      scope: {},
      controller: Schedule,
      controllerAs: 'sch',
      bindToController: {
        'source': '@src',
      }
      // link: function ($elem) {
      //   setTimeout(function () {
      //     $elem.css('width', 0);
      //   }, 1000);
      // }
    };
  });

})();