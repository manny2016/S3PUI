module.exports = function ($scope) {
    $('.ui.dropdown').dropdown();
    $('#scrollspy .list .item .label').popup()
    $scope.statistic = {
        title: 'Users Joined Discussion',
        volume: 3424,
        comment: 'Page Views - POST : NEG',
        labels: [{
            append: 1,
            color: 'red',
            icon: 1,
            text: 12
        }, {
                append: 0,
                color: 'green',
                icon: 0,
                text: 13
            }]
    }
}