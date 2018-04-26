var app = angular.module('app.Constant', []);

app.constant('CONST', {
    APP_NAME: 'Social Health Platform',
    APP_NAME_SHORT: 'SHP',
    DEFAULT_TIMEZONE:'PST',
    DEV_MODE:false,
    AD_CONFIG: {
        TENANT_ID: 'microsoft.onmicrosoft.com',
        CLIENT_ID: '482514c8-43d4-4421-a58e-73771b9e9e4c'
    },
    MESSAGE_TYPES: {
        'PostsVolumeSpikeDetected': 'Posts volume spike detected',
        'UniqueUserSessionsSpikeDetected': 'Unique user sessions spike detected',
        'PositiveVolumePostSpikeDetected': 'Positive volume post spike detected',
        'NegativeVolumePostSpikeDetected': 'Negative volume post spike detected',
        'ServicesMentionedSpikeDetected': 'Services mentioned spike detected',
        'InfluenceVolumeSpikeDetected': 'Influence volume spike detected',
        'ServiceOutageDetected': 'Possible service outage issues',
        'SupportExperienceIssuesDetected': 'Support experience issues'
    },
    SERVICE_INFO: {
        ENDPOINT: 'http://40.114.88.191/WebServices/S3PDataService/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'http://40.114.88.191/WebServices/S3PDataService/GetJobStatus',
        OTHERS_SERVER_STATUS:'http://40.121.205.38/WebServices/S3PDataService/GetJobStatus'
    },
    ALL_ENABLED_PLARFORMS: {
        'twitter': 'Twitter',
        'so': 'Stackoverflow',
        'sf': 'Serverfault',
        'su': 'Superuser',
        'msdn': 'MSDN',
        'tn': 'TechNet',
        'lithium':'Lithium',
        'dyn': 'Dynamics Community',
        'gith': 'GitHub'
    },
    WS_STATUS:{
        0 : 'connecting',
        1 : 'online',
        2 : 'closing',
        3 : 'offline'
    },
    ERRORS:{
        "1" : 'No Data Available',
        "2" : 'Null',
        "3" : 'N/A',
    }
})

module.exports = 'app.Constant';