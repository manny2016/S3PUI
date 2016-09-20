var app = angular.module('app.Filter', []);
app.filter('percentage', ['$window', function ($window) {
    return function (input, decimals, suffix) {
        decimals = angular.isNumber(decimals) ? decimals : 3;
        suffix = suffix || '%';
        if ($window.isNaN(input)) {
            return '';
        }
        return Math.round(Math.abs(input) * Math.pow(10, decimals + 2)) / Math.pow(10, decimals) + suffix
    };
}]);

app.filter('sentimentScore', ['$window', function ($window) {
    var dict = {
        '-1':'Undefined',
        '0':'Negative',
        '2':'Neutral',
        '4':'Positive'
    };
    return function (input) {
        return dict[input.toString()];
    };
}]);
module.exports = 'app.Filter';
