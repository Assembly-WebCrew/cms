(function () {
  'use strict';

  var LOCALE = {
    en: {
      ends: 'ends',
      starts: 'starts',
      original: 'originally scheduled',
      ongoing: 'ongoing',
      days: 'Days',
      filter: 'Filter',
			past: 'Past',
      search: 'Search',
      atTime: ' at',
      atDay: 'on',
      all: 'all'
    },
    fi: {
      ends: 'päättyy',
      starts:'alkaa',
      original: 'piti alkaa',
      ongoing: 'meneillään',
      days: 'Päivät',
      filter: 'Näytä',
			past: 'Menneet',
      search: 'Etsi',
      atTime: 'na klo',
      atDay: '',
      all: 'kaikki'
    }
  };

  function Schedule($http, $anchorScroll, $location, $interval) {
    var vm = this;

    vm.$location = $location;
    vm.locale = LOCALE[DJANGO.currentLanguage];
    vm.fieldSuffix = DJANGO.currentLanguage === 'en' ? '' : '_fi';
		vm.filters = {
			flags: [],
			showPast: false
		};

    $http.get(this.source).success(function (data) {
      vm.locations = _.mapValues(data.locations, vm.formatLocation.bind(vm));
      vm.processEvents(data.events);

      var current = $location.hash();

      if (current) {
        current = _.find(vm.events, 'id', current);
        if (current) current.isSelected = true;
        setTimeout($anchorScroll); // Scroll to selected event.
      }

      // Update ongoing events every minute.
      $interval(vm.updateEvents.bind(vm), 60 * 1000);
    });
  }

  Schedule.prototype.updateEvents = function () {
    this.events.forEach(function (event) {
      event.isOngoing = moment().isBetween(event.startTime, event.endTime);
    });
  };

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
    // vm.eventsByFlag = {};
    // vm.flags.forEach(function (flag) {
    //   vm.eventsByFlag[flag] = vm.events.filter(function (event) {
    //     return event.flags.indexOf(flag) === -1;
    //   });
    // });

    // Figure out event days.
    vm.days = _(vm.events).pluck('startTime').invoke('format', 'dddd').uniq().valueOf();
    vm.eventsByDay = {};
    vm.days.forEach(function (day) {
      vm.eventsByDay[day] = vm.events.filter(function (event) {
        return event.startTime.format('dddd') === day;
      });
    });
  };

  Schedule.prototype.formatEvent = function (event) {
    var start = moment(event.start_time, moment.ISO_8601).utcOffset(event.start_time),
      orig = moment(event.original_start_time, moment.ISO_8601).utcOffset(event.original_start_time),
      end = moment(event.end_time, moment.ISO_8601).utcOffset(event.end_time);

    return {
      id: event.key,
      name: event['name' + this.fieldSuffix],
      description: event['description' + this.fieldSuffix],
      url: event.url,
      flags: event.flags,
      categories: event.categories,
      location: this.locations[event.location_key],
      startTime: start,
      originalStartTime: orig,
      endTime: end,
      isRescheduled: !start.isSame(orig),
      isOngoing: moment().isBetween(start, end),
      isPast: moment().isAfter(end)
    };
  };

  Schedule.prototype.formatLocation = function (location) {
    return {
      name: location['name' + this.fieldSuffix],
      url: location.url
    };
  };

	Schedule.prototype.toggleFlag = function (flag) {
  	var vm = this;
		var flagIndex = -1;

		if ((flagIndex = vm.filters.flags.indexOf(flag)) === -1) {
			vm.filters.flags.push(flag);
		} else {
			vm.filters.flags.splice(flagIndex, 1);
		}
	};

	Schedule.prototype.togglePast = function () {
		var vm = this;

		vm.filters.showPast = !vm.filters.showPast;
	};

  Schedule.prototype.filterByFlags = function (events) {
    var vm = this;

    events.forEach(function (event) {
      if (event.isPast && !vm.filters.showPast) {
       return false;
      }
      if (vm.filters.flags.length > 0) {
      	var match;
      	for (var i = 0; i < event.flags.length; i++) {
      		if (vm.filters.flags.indexOf(event.flags[i]) > -1) {
      			match = true;
					}
				}
				return match;
			}
    });
  };

  angular.module('asmApp').directive('asmSchedule', function () {
    return {
      restrict: 'E',
      templateUrl: DJANGO.staticPath + 'components/schedule/schedule.html',
      scope: {},
      controller: Schedule,
      controllerAs: 'sch',
      bindToController: {
        'source': '@src'
      }
    };
  });

})();
