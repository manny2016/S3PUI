module.exports = function () {
    return {
        restrict: 'E',
        template: '<div class="ui input mini">'
                + '<input class="select-page" type="text" ng-model="inputPage" ng-change="selectPage(inputPage)">'
                + '</div>',
        link: function(scope, element, attrs) {
          scope.$watch('currentPage', function(c) {
            scope.inputPage = c;
          });
        } 
      }
} 