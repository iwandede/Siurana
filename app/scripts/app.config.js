(function() {
  'use strict'

  /**
  * @module climbingMemo
  * @name climbingMemo.app:Config
  * @description
  * Application configuration (constant, config, run)
  */
  angular.module('climbingMemo')
  .constant('DATABASE_URL', 'https://climbing-memo.firebaseio.com/')

  angular.module('climbingMemo')
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    })
  })

  angular.module('climbingMemo')
  .run(function($window, $rootScope, $log) {
    $rootScope.online = navigator.onLine // jshint ignore:line
    // FIXME
    $window.addEventListener("offline", function() {
      $rootScope.$apply(function() {
        $rootScope.online = false
      })
    }, false)
    $window.addEventListener("online", function() {
      $rootScope.$apply(function() {
        $rootScope.online = true
      })
    }, false)

    var appCache = $window.applicationCache
    try {
      appCache.update() // Attempt to update the user's cache.

      if (appCache.status === $window.applicationCache.UPDATEREADY) {
        appCache.swapCache()  // The fetch was successful, swap in the new cache.
      }
    } catch (error) {
      $log.info("Error updating cache (manifest)")
    }
  })
// jscs:disable disallowSemicolons
})();
