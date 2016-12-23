module.exports = function ($scope, $location, $timeout, $http, $filter, toastr) {
    // console.log("this is admin");  
    $scope.platforms = [];
    var CONST_MSDN_CFG = {
        topic: '',
        tagsCfg: {}
    };
    var CONST_KWD_CFG = {
            topic: '',
            tagsCfg: {
                topic: '',
                Keywords: []
            }
        }
        // $scope.isAddNew = false;
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
            $scope.originData = angular.copy($scope.TopicWithForum);
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

    $scope.selectPlatform = function (index) {
        $scope.selectedPlatformIndex = index;
        var p = $scope.TopicWithForum[index];
        $scope.selectedPlatform = p.platform_Name;
        // $scope.topics = $scope.TopicWithForum[index].topics;
        $scope.selectTopic("");
        // $scope.cancelUpdate();
    }
    $scope.isSelectedPlatform = function (platform) {
        return $scope.selectedPlatform === platform;
    }
    $scope.selectTopic = function (index) {
        $scope.filterTags = "";
        $scope.selectedTopicIndex = index;
        if (Number.isInteger(index)) {
            var t = $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[index];
            $scope.selectedTopic = t.topic;
        } else {
            $scope.selectedTopic = undefined;
        }

        // $scope.currentTopic = t;
        // $scope.cancelUpdate();
    }
    $scope.isSelectedTopic = function (t) {
        return $scope.selectedTopic === t;
    }
    $scope.autoScale = function (e) {
        console.log(e)
    }
    $scope.addKwd = function (event) {
            event.stopPropagation();
            var currentTopic = $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex];
            var array = currentTopic.tagsCfg.Keywords;
            var string = event.target.value.trim()
            if (string !== "" && array.indexOf(string) === -1) {
                array.push(string);
            }
            event.target.value = "";
        }
        // $('.admin.cards .card').dimmer({
        //     on: 'hover'
        // });
    $scope.cancelUpdate = function () {
        var src = angular.copy($scope.originData);
        var dist = $scope.TopicWithForum;
        if (Number.isInteger($scope.selectedTopicIndex)) {
            angular.extend(dist[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex],
                src[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex]);
        }else{
            angular.extend(dist[$scope.selectedPlatformIndex],
                src[$scope.selectedPlatformIndex]);
        }
        // $scope.$digest();
        // angular.extend($scope.TopicWithForum, $scope.originData);
        // console.log($scope.originData);
        // console.log($scope.TopicWithForum);
        // console.log($scope.originData === $scope.TopicWithForum)
    }
    $scope.approveUpdate = function () {
        $scope.originData = angular.copy($scope.TopicWithForum);
        toastr.success('Success', 'Operation Success!');
        // $scope.$digest();
    }
    $scope.forumSelectChanged = function (index) {
        if (index === null) {
            $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex].tagsCfg = {};
        } else {
            console.log(index);
            var tagCfg = $filter('findObjectInArray')(angular.copy($scope.MsdnTopicMapping), 'topic', index);
            console.log(angular.copy(tagCfg));
            $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex].tagsCfg = angular.copy(tagCfg);
        }
    }
    $scope.isDirty = function () {
        return !angular.equals(angular.copy($scope.originData), angular.copy($scope.TopicWithForum));
    }
    $scope.removeTopic = function (index) {
        $('#removeConfirmModal').modal({
            onDeny: function () {},
            onApprove: function () {
                $scope.TopicWithForum[$scope.selectedPlatformIndex].topics.splice(index, 1);
                $scope.selectedTopic = undefined;
                $scope.$digest();
            }
        }).modal('show')
    }
    $scope.newScope = function () {
        // $scope.isAddNew = true;
        var newScope = {};
        $('#newServiceModal').modal({
            onDeny: function () {
                // return false;
                $scope.newTopicName = '';
            },
            onApprove: function () {
                if ($scope.newTopicName.trim() === '') {

                } else {
                    switch ($scope.selectedPlatform) {
                        case 'so':
                        case 'sf':
                        case 'su':
                        case 'twitter':
                            newScope = angular.copy(CONST_KWD_CFG);
                            newScope.topic = $scope.newTopicName;
                            break;
                        case 'msdn':
                        case 'tn':
                            newScope = angular.copy(CONST_MSDN_CFG);
                            newScope.topic = $scope.newTopicName;
                            newScope.tagsCfg.topic = $scope.newTopicName;
                            break;
                    }
                    $scope.TopicWithForum[$scope.selectedPlatformIndex].topics.push(newScope)
                    $scope.newTopicName = '';
                    $scope.$digest();
                }
            }
        }).modal('show')

    }
    $scope.init()
}