var app = angular.module('app.Constant', []);

app.constant('CONST', {
    APP_NAME: 'Social Health Platform',
    APP_NAME_SHORT: 'SHP',
    AD_CONFIG: {
        TENANT_ID: 'microsoft.onmicrosoft.com',
        CLIENT_ID: '482514c8-43d4-4421-a58e-73771b9e9e4c'
    },
    MESSAGE_TYPES: {
        '1': 'Posts volumn spike detected',
        '2': 'Unique user sessions spike detected',
        '3': 'Positive volume post spike detected',
        '4': 'Negative volume post spike detected',
        '5': 'Services mentioned spike detected',
        '6': 'Influence volume spike detected',
        '7': 'Support experience issues',
        '8': 'Possible service outage issues'
    },
    SERVICE_INFO: {
        ENDPOINT: '/DataService/S3PDataService.svc/',
        // WS:'ws://10.168.176.18/api/SystemDetected/',
        WS: 'ws://localhost:8889/',
        LOCAL_TEST_DATA: '/data/'
    },
    ALL_ENABLED_PLARFORMS: {
        'twitter': 'Twitter',
        'so': 'Stackoverflow',
        'sf': 'Serverfault',
        'su': 'Superuser',
        'msdn': 'MSDN',
        'tn': 'Telnet'
    },
    WS_STATUS:{
        0 : 'connecting',
        1 : 'online',
        2 : 'closing',
        3 : 'offline'
    }
})

module.exports = 'app.Constant';