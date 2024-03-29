(function() {
  'use strict'

  /**
  * @module climbingMemo
  * @name climbingMemo.controller:ModalsliderCtrl
  * @description
  * # ModalsliderCtrl
  * Controller of the climbingMemo
  */
  angular.module('climbingMemo')
  .controller('ModalsliderCtrl', modalSliderController)

  modalSliderController.$inject = [
    '$scope',
    '$uibModalInstance',
    '$localStorage',
    '$log',
    '$rootScope',
    '$filter',
    'routesId',
    'routeNoteFormattingFilter',
    'utilsRouteSvc'
  ]

  function modalSliderController($scope, $uibModalInstance, $localStorage, $log,
  $rootScope, $filter, routesId, routeNoteFormattingFilter, utilsRouteSvc) {

    /**
    * Close the modal
    *
    * @method closeModal
    */
    $scope.closeModal = function() {
      $uibModalInstance.dismiss('cancel')
    }

    // Get Data
    utilsRouteSvc.getRoutes().then(function(data) {
      $scope.initController(data)
    })

    /**
    * Create slider based on routesId
    *
    * @method initController
    * @param {Array} routes
    */
    $scope.initController = function(routes) {
      var displayedRoutes = _.map(routesId, function(id) {
        return _.find(routes, function(route) {
          return route.id === id
        })
      })

      $scope.myInterval = 0
      $scope.noWrapSlides = false
      $scope.slides = _.map(displayedRoutes, function(route) {
        route.notes = routeNoteFormattingFilter(route.notes)
        return {
          content: route
        }
      })
    }

    $scope.editRoute = function(route) {
      route.$date = new Date(route.date)
      route.$editMode = true
    }

    $scope.deleteRoute = function(route) {
      route.$editMode = false
      utilsRouteSvc.deleteRoute(route)
      .then(function(routeId) {
        $rootScope.$broadcast('routesUpdated', routeId)
      })

      $scope.closeModal()
    }

    $scope.copyRoute = function(route) {
      route.$copy = JSON.parse(JSON.stringify(route)) // Clone
      route.id = false // Will create new route
      $scope.editRoute(route)
    }

    $scope.saveRoute = function(route) {
      route.$editMode = false

      utilsRouteSvc.saveRoute(route)
      .then(function(routeId) {
        $rootScope.$broadcast('routesUpdated', routeId)
      }).catch(function(routeId) {
        $rootScope.$broadcast('routesUpdated', routeId)
      })

      $scope.closeModal()
    }

    $scope.cancelEdit = function(route) {
      route.$editMode = false
      $scope.closeModal()
    }

    /**
    * Create an array of size N
    *
    * @method getTimes
    * @param {Integer} n
    * @return {Array}
    */
    $scope.getTimes = function(n) {
      return new Array(n)
    }

    /**
    * Flip the active slide
    *
    * @method flipCard
    */
    $scope.flipCard = function() {
      var activeSlide = _.first($scope.slides.filter(function(slide) {
        return slide.active
      }))
      activeSlide.$hover = !activeSlide.$hover
    }

    $scope.getIconStatus  = function(route) { return utilsRouteSvc.getIconStatus(route) }
    $scope.getIconRock    = function(route) { return utilsRouteSvc.getIconRock(route) }
    $scope.getIndoorLabel = function(route) { return utilsRouteSvc.getIndoorLabel(route) }
    $scope.getTypeColor   = function(route) { return utilsRouteSvc.getTypeColor(route) }
  }
// jscs:disable disallowSemicolons
})();
