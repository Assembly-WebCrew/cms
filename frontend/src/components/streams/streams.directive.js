(function () {
  'use strict';

  var LOCALE = {
    en: {
    },
    fi: {
    }
  };

  var JSON = {"1":{"Game":{"id":"1","name":"StarCraft 2","shortname":"sc2","online":"0"},"Stream":[{"id":"4","name":"AssemblyTV","country_iso":"FI","online":"0","viewers":null,"public":"1","last_online":null},{"id":"6","name":"Wardi","country_iso":"GB","online":"0","viewers":null,"public":"1","last_online":null},{"id":"7","name":"Zerg","country_iso":"RU","online":"0","viewers":null,"public":"1","last_online":null}]},"2":{"Game":{"id":"2","name":"Counter-Strike: GO","shortname":"csgo","online":"0"},"Stream":[{"id":"3","name":"CS:GO English","country_iso":"GB","online":"0","viewers":null,"public":"1","last_online":null}]},"10":{"Game":{"id":"10","name":"Hearthstone","shortname":"hs","online":"0"},"Stream":[{"id":"5","name":"AssemblyTV","country_iso":"FI","online":"0","viewers":null,"public":"1","last_online":null},{"id":"8","name":"Raven","country_iso":"GB","online":"0","viewers":null,"public":"1","last_online":null},{"id":"9","name":"GamersOrigin","country_iso":"FR","online":"0","viewers":null,"public":"1","last_online":null},{"id":"10","name":"Millenium","country_iso":"FR","online":"0","viewers":null,"public":"1","last_online":null}]}};

  function Streams($http) {
    var vm = this;

    vm.locale = LOCALE[DJANGO.currentLanguage];

    $http.get(this.source).success(function (data) {
      //var data = JSON; // MOCK

      console.log(data);
      vm.data = data;
    });
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
