module.exports = function ($scope, $location, $timeout, $http) {
    // console.log("this is admin");  



    $scope.platforms = [];
    // $scope.getTopics = function () {
    //     $scope.service.getCate().then(function (data) {
    //         console.log(data)
    //         $scope.topics = data;
    //     })
    // }();
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
            $scope.platforms = ['twitter', 'so', 'sf', 'su', 'msdn', 'tn']
        }, 500)
    }();
    // $scope.topics = ['Azure', 'Office365', 'CRM Online', 'Intune'];

    $scope.getConfigData = function () {
        $http.get('/data/adminpage.json').then(function (data) {
            console.log(data.data);
            $scope.MsdnTopicMapping = data.data.MsdnTopicMapping;
            $scope.TopicWithForum = data.data.TopicWithForum;
        })
    }
    $scope.init = function () {
        $scope.getConfigData();
    }

    $scope.renderDimmer = function () {
        $timeout(function () {
            $('.hover.dimmer').dimmer({
                on: 'hover',
            });
        }, 0)
    }

    $scope.selectPlatform = function (platform) {
        $scope.selectedPlatform = platform.platform_Name;
        $scope.topics = platform.topics;
    }
    $scope.isSelectedPlatform = function (platform) {
        return $scope.selectedPlatform === platform;
    }
    $scope.selectTopic = function (t) {
        $scope.selectedTopic = t.topic;
        $scope.currentTopic = t;
    }
    $scope.isSelectedTopic = function (t) {
        return $scope.selectedTopic === t;
    }
    $scope.autoScale = function (e) {
        console.log(e)
    }
    $scope.addKwd = function (event, array) {
        console.log(event);
        if (event.currentTarget.value) {
            array.push(event.currentTarget.value);
            event.currentTarget.value = "";
        }
    }
        // $('.admin.cards .card').dimmer({
        //     on: 'hover'
        // });

    $scope.init()
}