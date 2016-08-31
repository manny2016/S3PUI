var app = require('angular').module("app",[require('./controller'), require('./service'), require('./directive'),require('../../node_modules/angular-scroll')]);
app.
  run(function($rootScope) {
    if(!window.history || !history.replaceState) {
      return;
    }
    $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
      //Automaticly update location
      var color = $element.parent().attr('set-color');
      $($element.parent()).addClass(color);
      var siblings = $element.parent().parent().siblings();
      var labels = $(siblings).find("div.ui.label");
      for(var i=0;i<labels.length;i++){
          var e = $(labels.get(i));
          e.removeClass(e.attr('set-color'))
      }
      var hash = $element.prop('hash');
      if (hash) {
        history.replaceState(null, null, hash);
    });
  });
app.controller("homeCtrl",function($scope){

})