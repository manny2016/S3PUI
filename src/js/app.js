var app = require('angular').module("app", [require('./controller'), require('./service'), require('./directive'), require('../../node_modules/angular-scroll'), require('../../node_modules/angular-route')]);
app.
  run(function ($rootScope) {
    if (!window.history || !history.replaceState) {
      return;
    }
    $rootScope.$on('duScrollspy:becameActive', function ($event, $element, $target) {
      //Automaticly update location
      var color = $element.find("div").attr('set-color');
      $($element.find("div")).addClass(color);
      var siblings = $element.parent().siblings();
      var labels = $(siblings).find("div.ui.label");
      for (var i = 0; i < labels.length; i++) {
        var e = $(labels.get(i));
        e.removeClass(e.attr('set-color'))
      }
      var hash = $element.prop('hash');
      if (hash) {
        history.replaceState(null, null, hash);
      }
    });

    // $(window).resize(function () {
    //   console.log(window.innerWidth);
    // })
    
  });
app.controller("homeCtrl", function ($scope) {

})