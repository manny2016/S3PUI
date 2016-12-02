var app = angular.module('app.Constant',[]);

app.constant('CONST',{
    APP_NAME:'Social Health Platform',
    APP_NAME_SHORT:'SHP',
    AD_CONFIG:{
        TENANT_ID:'microsoft.onmicrosoft.com',
        CLIENT_ID:'482514c8-43d4-4421-a58e-73771b9e9e4c'
    },
    MESSAGE_TYPES:{
        '1':'Posts volumn spike detected',
        '2':'Unique user sessions spike detected',
        '3':'Positive volume post spike detected',
        '4':'Negative volume post spike detected',
        '5':'Services mentioned spike detected',
        '6':'Influence volume spike detected'
    },
})

module.exports = 'app.Constant';
