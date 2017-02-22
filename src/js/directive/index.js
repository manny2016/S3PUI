angular.module('angularify.semantic.dropdown', [])
  .controller('DropDownController', ['$scope',
    function($scope) {
      $scope.options = [];

      this.add_option = function(title, value){
        $scope.options.push({'title': title, 'value': value});
        if (value == $scope.model){
          this.update_title(value)
        };
      };

      this.remove_option = function(title, value){
        for (var index in $scope.options)
          if ($scope.options[index].value == value &&
            $scope.options[index].title == title){

            $scope.options.splice(index, 1);
            // Remove only one item
            break;
          };
      };

      this.update_model = function (title, value) {
        if ($scope.model !== value)
          $scope.model = value;
      };

      this.update_title = function (value) {
        var changed = false;

        for (var index in $scope.options)
          if ($scope.options[index].value == value){
            $scope.title = $scope.options[index].title;
            changed = true;
          }

        if (changed){
          $scope.text_class = 'text';
        } else{
          $scope.title = $scope.original_title;
          $scope.text_class = 'default text';
        }
      };

    }
  ])

.directive('dropdown', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'DropDownController',
    scope: {
      title: '@',
      open: '@',
      model: '=ngModel'
    },
    template: '<div class="{{ dropdown_class }}">' +
      '<div class="{{text_class}}">{{ title }}</div>' +
      '<i class="dropdown icon"></i>' +
      '<div class="{{ menu_class }}"  ng-transclude>' +
      '</div>' +
      '</div>',
    link: function(scope, element, attrs, DropDownController) {
      scope.dropdown_class = 'ui selection dropdown';
      scope.menu_class = 'menu transition hidden';
      scope.text_class = 'default text';
      scope.original_title = scope.title;

      if (scope.open === 'true') {
        scope.is_open = true;
        scope.dropdown_class = scope.dropdown_class + ' active visible';
        scope.menu_class = scope.menu_class + ' visible';
      } else {
        scope.is_open = false;
      }

      /*
       * Watch for ng-model changing
       */
      scope.element = element;
      scope.$watch('model', function (value) {
        // update title or reset the original title if its empty
        DropDownController.update_title(value);
      });

      /*
       * Click handler
       */
      element.bind('click', function() {
        if (scope.is_open === false) {
          scope.$apply(function() {
            scope.dropdown_class = 'ui selection dropdown active visible';
            scope.menu_class = 'menu transition visible';
          });
        } else {
          scope.$apply(function() {
            scope.dropdown_class = 'ui selection dropdown';
            scope.menu_class = 'menu transition hidden';
          });
        }
        scope.is_open = !scope.is_open;
      });
    }
  };
})

.directive('dropdownGroup', function() {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    require: '^dropdown',
    scope: {
      title: '=title',
      value: '=value'
    },
    template: '<div class="item" ng-transclude>{{ item_title }}</div>',
    link: function(scope, element, attrs, DropDownController) {

      // Check if title= was set... if not take the contents of the dropdown-group tag
      // title= is for dynamic variables from something like ng-repeat {{variable}}
      if (scope.title === undefined) {
        scope.item_title = attrs.title || element.children()[0].innerHTML;
      } else {
        scope.item_title = scope.title;
      }
      if (scope.value === undefined) {
        scope.item_value = attrs.value || scope.item_title;
      } else {
        scope.item_value = scope.value;
      }

      // Keep this option
      DropDownController.add_option(scope.item_title, scope.item_value);

      //
      // Menu item click handler
      //
      element.bind('click', function() {
        DropDownController.update_model(scope.item_title, scope.item_value);
      });

      scope.$on('$destroy', function(){
        DropDownController.remove_option(scope.item_title, scope.item_value);
      });

    }
  };
});


var app = angular.module('app.Directive', ['ngSanitize','angularify.semantic.dropdown']);

app.directive('ngEchart', require('./chartDirective'));
app.directive('ngRadarEchart', require('./chartRadarDirective'));
app.directive('ngStatistic', require('./statisticDirective'));
app.directive('ngStatisticLabel', require('./statisticLabelDirective'));
app.directive('ngScrollSpy', require('./scrollspyDirective'));
app.directive('ngChartShape', require('./chartShapeDirective'));
// app.directive('ngChartNestShape',require('./chartNestShapeDirective')); 
app.directive('userList', require('./userListDirective'));
app.directive('subWindow', require('./subWindowDirective'));
app.directive('topicQuery', require('./topicQueryDirective'));
app.directive('selectPage', require('./selectPageDirective'));
app.directive('mentionedTable', require('./mentionedTableDirective'));
app.directive('regionTable', require('./regionTableDirective'));

app.directive('adminCard', require('./adminCardDirective'));
app.directive('platformCardContent', require('./platformCardContentDirective'));
app.directive('scopeCardContent', require('./scopeCardContentDirective'));
app.directive('scopeTagsEditer', require('./scopeTagsDirective'));
// require('./ng-FitText.js');
app.directive('fittext', function ($timeout) {
    return {
        restrict: 'A',
        scope:{
            fittext:'=',
            height:"@"
        },
        link: function (scope, element, attr) {
            // var height = element.height();
            var regexp = /\d+(\.\d+)?/;
            $timeout(function(){
                while(element.height()>scope.height){
                    var fontSize = element.css('font-size').match(regexp);;
                    element.css('font-size',fontSize[0] - 1);
                }
                element.height(scope.height);
                // console.log(element.height());
            },0);
        }
    }
});
// app.directive('compile', function ($compile) {
//     return {
//         restrict: 'A',
//         replace: true,
//         link: function (scope, element, attrs) {
//             scope.$watch(function (scope) {
//                 return scope.$eval(attrs.compile);
//             }, function (html) {
//                 console.log(html)
//                 element.html(html);
//                 $compile(element.contents())(scope);
//             });
//         }
//     }
// })




module.exports = 'app.Directive';