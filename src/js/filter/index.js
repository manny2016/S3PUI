var app = angular.module('app.Filter', ['app.Srv']);
app.filter('percentage', ['$window', function ($window) {
    return function (input, decimals, notAbsolute, suffix) {
        var decimals = angular.isNumber(decimals) ? decimals : 3;
        var suffix = suffix || '%';
        if ($window.isNaN(input)) {
            return '';
        }
        if(!notAbsolute){
            input = Math.abs(input);
        }
        return Math.round(input * Math.pow(10, decimals + 2)) / Math.pow(10, decimals) + suffix
    };
}]);

app.filter('sentimentScore', ['$window', function ($window) {
    var dict = {
        '-1': 'Undefined',
        '0': 'Negative',
        '2': 'Neutral',
        '4': 'Positive'
    };
    return function (input) {
        return dict[input.toString()];
    };
}]);

app.filter('timetostring', ['utilitySrv', function (utilitySrv) {
    return function (input) {
        return utilitySrv.timeToString(input);
    }
}]);

app.filter('thousandsuffix', ['$window', function ($window) {
    return function (input, decimals) {
        var exp, rounded,
            decimals = angular.isNumber(decimals) ? decimals : 2,
            suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

        if ($window.isNaN(input)) {
            return input;
        }
        // if (input === 0 ) {
        //     return "No Data Available";
        // }
        if (input < 1000) {
            return input;
        }
        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
    };
}]);
module.exports = 'app.Filter';
