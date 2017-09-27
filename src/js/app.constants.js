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
    TOPICS_V3: ["Azure", "UWP", "PowerBI", "PowerApp", "MS Flow", "EMS", "VS", "VSTS", "Windows Client", "Windows Server", "Exchange", "Skype for Business", "HoloLens"],
    SERVICE_INFO: {
        ENDPOINT: 'https://shpv3-api.azurewebsites.net/api/v2/',
        ENDPOINT2: 'https://shpv3-api.azurewebsites.net/api/v2/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv3-api.azurewebsites.net/api/v2/GetTwitterJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv3-api.azurewebsites.net/api/v2/GetOtherJobStatus'
        /*
        PROD
        ENDPOINT: 'https://shpv2-api.azurewebsites.net/WebServices/SHPDateUnlimitedDataService/',
        ENDPOINT: 'https://shpv2-api.azurewebsites.net/WebServices/SHPDateUnlimitedDataService/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv3-api.azurewebsites.net/api/v2/GetTwitterJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv3-api.azurewebsites.net/api/v2/GetOtherJobStatus'

        UAT
        ENDPOINT: 'https://shpv2-uat.azurewebsites.net/WebServices/SHPDateUnlimitedDataService/',
        ENDPOINT2: 'https://shpv3-api.azurewebsites.net/api/v2/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv3-api.azurewebsites.net/api/v2/GetTwitterJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv3-api.azurewebsites.net/api/v2/GetOtherJobStatus'

        Exchange
        ENDPOINT: 'https://shpv2-exchange-dataslice.azurewebsites.net/WebServices/S3PDataService/',
        ENDPOINT2: 'https://shpv2-exchange-dataslice.azurewebsites.net/WebServices/S3PDataService/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv2-exchange-dataslice.azurewebsites.net/WebServices/S3PDataService/GetJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv2exchange.azurewebsites.net/WebServices/S3PDataService/GetJobStatus'

        V3
        ENDPOINT: 'https://shpv3-api.azurewebsites.net/api/v2/',
        ENDPOINT2: 'https://shpv3-api.azurewebsites.net/api/v2/',
        LOCAL_TEST_DATA: '/data/',
        TWITTER_SERVER_STATUS:'https://shpv3-api.azurewebsites.net/api/v2/GetTwitterJobStatus',
        OTHERS_SERVER_STATUS:'https://shpv3-api.azurewebsites.net/api/v2/GetOtherJobStatus'

        Local
        ENDPOINT: 'http://localhost:30322/WebServices/SHPDateUnlimitedDataService/',
        ENDPOINT2: 'http://localhost:64815/api/v2/',
        LOCAL_TEST_DATA: '/data/',
        ENDPOINT2: 'http://localhost:64815/api/v2/GetTwitterJobStatus',
        ENDPOINT2: 'http://localhost:64815/api/v2/GetOtherJobStatus'
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