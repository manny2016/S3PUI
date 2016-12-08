var app = angular.module('app.Directive', ['ngSanitize']);

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

app.directive('adminCard', require('./adminCardDirective'));
app.directive('platformCardContent', require('./platformCardContentDirective'));

// app.directive('onFinishRender', function ($timeout) {
//     return {
//         restrict: 'A',
//         link: function (scope, element, attr) {
//             $timeout(function () {
//                 scope.$emit(attr.onFinishRender);
//             });
//         }
//     }
// });
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