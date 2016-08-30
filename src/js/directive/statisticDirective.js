module.exports = function () {
    var colors = ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black'];
    return{
        restrict: 'E',
        templateUrl: ('public/template/statistic.html'),
        replace: true,
        scope: {
            data: "="
        },
        link:function(scope,e,a){
            scope.color = colors[Math.round(Math.random()*colors.length)];
            scope.title = scope.data.title;
            scope.volume = scope.data.volume;
            scope.labels = scope.data.labels;
        }
    }
}