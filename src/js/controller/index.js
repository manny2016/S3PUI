var app = angular.module('app.Ctrl', []);

// app.controller('testCtrl',require('./testCtrl'));
app.controller('homeCtrl',require('./homeCtrl'));
// app.controller('navCtrl',require('./navCtrl'));
app.controller('socialCtrl',require('./socialCtrl'));
app.controller('adminCtrl',require('./adminCtrl'));
// app.controller('scrollCtrl',require('./scrollCtrl'));
// app.controller('msPlatformCtrl',require('./msPlatformCtrl'));
// app.controller('thirdPartyCtrl',require('./thirdPartyCtrl'));
module.exports = 'app.Ctrl';