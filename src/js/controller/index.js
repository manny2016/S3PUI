'use strict';

var app = angular.module('app.Ctrl', []);

app.controller('testCtrl',require('./testCtrl'));
app.controller('homeCtrl',require('./homeCtrl'));
app.controller('socialCtrl',require('./socialCtrl'));
app.controller('scrollCtrl',require('./scrollCtrl'));
module.exports = 'app.Ctrl'; 