(function () {
  'use strict';

  var LOCALE = {
    en: {
      isOnline: 'Online',
      isOffline: 'Offline',
      viewCount: 'Viewers'
    },
    fi: {
      isOnline: 'Linjoilla',
      isOffline: 'Poissa linjoilta',
      viewCount: 'Katsojia'
    }
  };

  var STREAM_BASE_URL = 'http://tournaments.peliliiga.fi/summer16/streams/view';

  function Streams($http) {
    var vm = this;
    vm.$http = $http;
    vm.locale = LOCALE[DJANGO.currentLanguage];
    vm.baseUrl = STREAM_BASE_URL;
    vm.streams = [];
    vm.update();
  }

  Streams.prototype.update = function () {
    var vm = this;
    return vm.$http.get(this.source).success(function (data) {
      vm.data = data;
      vm.games = _(data).map(parseGame).valueOf();
    });
  };

  function parseGame(data) {
    return {
      id: data.Game.id,
      name: data.Game.name,
      slug: data.Game.shortname,
      isOnline: data.Game.online === '1',
      streams: _(data.Stream).map(parseStream).valueOf()
    }
  }

  function parseStream(data) {
    return {
      id: data.id,
      name: data.name,
      country: data.country_iso,
      isOnline: data.online === '1',
      viewers: parseInt(data.viewers || 0, 10),
      isPublic: data.public === '1',
      lastOnline: data.last_online ? moment.unix(parseInt(data.last_online, 10)) : undefined
    };
  }

  angular.module('asmApp').directive('asmStreams', function () {
    return {
      restrict: 'E',
      templateUrl: DJANGO.staticPath + 'components/streams/streams.html',
      scope: {},
      controller: Streams,
      controllerAs: 'streams',
      bindToController: {
        'source': '@src'
      }
    };
  });

})();
