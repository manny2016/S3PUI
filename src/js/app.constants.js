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
        ENDPOINT: 'https://shpv2-exchange-dataslice.azurewebsites.net/WebServices/S3PDataService/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv2-exchange-dataslice.azurewebsites.net/WebServices/S3PDataService/GetJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv2exchange.azurewebsites.net/WebServices/S3PDataService/GetJobStatus'
        /*
        ENDPOINT: 'https://shpv2-dataslice.azurewebsites.net/WebServices/S3PDataService/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv2-dataslice.azurewebsites.net/WebServices/S3PDataService/GetJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv2-rawdata-proccess.azurewebsites.net/WebServices/S3PDataService/GetJobStatus'

        ENDPOINT: 'https://shpv2-exchange-dataslice.azurewebsites.net/WebServices/S3PDataService/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv2-exchange-dataslice.azurewebsites.net/WebServices/S3PDataService/GetJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv2exchange.azurewebsites.net/WebServices/S3PDataService/GetJobStatus'

        ENDPOINT: 'https://shpv2-uat-slicing.azurewebsites.net/WebServices/S3PDataService/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv2-uat-slicing.azurewebsites.net/WebServices/S3PDataService/GetJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv2-orchard-01.azurewebsites.net/WebServices/S3PDataService/GetJobStatus'

        ENDPOINT: 'https://localhost:44300/WebServices/S3PDataService/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'http://52.168.10.62/WebServices/S3PDataService/GetJobStatus',
        OTHERS_SERVER_STATUS:'http://40.71.248.101/WebServices/S3PDataService/GetJobStatus'
        */
    },
    ALL_ENABLED_PLARFORMS: {
        'twitter': 'Twitter',
        'so': 'Stackoverflow',
        'sf': 'Serverfault',
        'su': 'Superuser',
        'msdn': 'MSDN',
        'tn': 'TechNet',
        'lithium':'Lithium'
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