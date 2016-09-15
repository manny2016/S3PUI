module.exports = function () {
    return {
        restrict: 'E',
        template: '<div class="ui input mini select-page">'
                + '<input type="text" ng-model="inputPage" ng-change="selectPage(inputPage)">'
                + '</div>',
        link: function(scope, element, attrs) {
          scope.$watch('currentPage', function(c) {
            scope.inputPage = c;
          });
        } 
      }
}