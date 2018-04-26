module.exports = function ($scope, $rootScope, $window, $location, $state, $timeout, $http, $filter, toastr) {
    if (!$scope.isAdmin) {
        $state.go('home.dashboard');
    }
    $scope.platforms = [];
    $scope.search = {
        datasource: 'all',
        messagetype: 'all',
        topic: 'all'
    }

    function generateNewScopeObj(platform) {
        var newScope = {
            topic: $scope.newTopicName,
            topicsettings: {
                topic: $scope.newTopicName
            }
        };
        switch (platform) {
            case 'so':
            case 'sf':
            case 'su':
            case 'lithium':
            case 'twitter':
                newScope.topicsettings.Keywords = [];
                break;
            case 'msdn':
            case 'tn':
                newScope.topicsettings.Tags = [];
                break;
        }
        return newScope;
    }
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
    //         $scope.topics = data;
    //     })
    // }();
    // $timeout(function(){$('.tabular.menu .item').tab()},0);
    $('.tabular.menu .item').tab();
    $('.vertical.menu .item').tab();
    $('.ui.checkbox').checkbox();
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
            $scope.platforms = ['twitter', 'so', 'sf', 'su', 'msdn', 'tn','gith','dyn']
        }, 500)
    }();
    // $scope.topics = ['Azure', 'Office365', 'CRM Online', 'Intune'];

    $scope.getConfigData = function () {
        $scope.service.getPlatformSyncSetting().then(function (data) {
            $scope.MsdnTopicMapping = data.MsdnTopicMapping;
            $scope.TopicWithForum = data.TopicWithForum;
            $scope.originData = angular.copy($scope.TopicWithForum);
        })
    }
    $scope.init = function () {
        $timeout(function () {
            // $('.ui.fluid.dropdown').dropdown();
        }, 50)
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
    }
    $scope.addKwd = function (event) {
        event.stopPropagation();
        var currentTopic = $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex];
        // if(!currentTopic[$scope.tagsCfg].Keywords){
        //     currentTopic[$scope.tagsCfg].Keywords = [];
        // }
        var array = currentTopic.topicsettings.Keywords;
        var string = (event.target.value || event.target.previousElementSibling.value).trim()
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
        } else {
            angular.extend(dist[$scope.selectedPlatformIndex],
                src[$scope.selectedPlatformIndex]);
        }
        // $scope.$digest();
        // angular.extend($scope.TopicWithForum, $scope.originData);
    }
    $scope.approveUpdate = function () {
        $scope.originData = angular.copy($scope.TopicWithForum);
        $scope.service.saveForumServiceSetting({
            "MsdnTopicMapping": $scope.MsdnTopicMapping,
            "TopicWithForum": $scope.originData
        }).then(function (data) {
            if (data == true) {
                toastr.success('Success', 'Operation Success!');
            } else {
                toastr.error('Error', 'Operation Failed!');
            }
        })
        // $scope.$digest();
    }
    $scope.forumSelectChanged = function (index) {
        if (index === null) {
            $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex].topicsettings = {};
        } else {
            var tagCfg = $filter('findObjectInArray')(angular.copy($scope.MsdnTopicMapping), 'topic', index);
            $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex].topicsettings = angular.copy(tagCfg);
        }
    }
    $scope.isDirty = function () {
        return !angular.equals(angular.copy($scope.originData), angular.copy($scope.TopicWithForum));
    }
    $scope.removeTopic = function (index) {
        $('#removeConfirmModal').modal({
            onDeny: function () { },
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
                    newScope = generateNewScopeObj($scope.selectedPlatform);
                    // switch ($scope.selectedPlatform) {
                    //     case 'so':
                    //     case 'sf':
                    //     case 'su':
                    //         // newScope.stackExchange.Keywords = [];
                    //         // break;
                    //     case 'lithium':
                    //     case 'twitter':
                    //         newScope.topicsettings.Keywords = [];
                    //         break;
                    //     case 'msdn':
                    //     case 'tn':
                    //         newScope.topicsettings.Tags = [];
                    //         break;
                    // }
                    $scope.TopicWithForum[$scope.selectedPlatformIndex].topics.push(newScope)
                    $scope.newTopicName = '';
                    $scope.$digest();
                }
            }
        }).modal('show')

    }
    $scope.init();

    $scope.getTopics = function () {
        $scope.service.getCate().then(function (data) {
            $scope.enabledTopics = data;
            var multipleSelectedTopics = [];
            $.each(data, function (i, topic) {
                if (topic.isGA === true) {
                    multipleSelectedTopics.push(topic.TechCategoryName);
                }
            });
            $scope.multipleSelectedTopics = multipleSelectedTopics;
        })
    }();
    $scope.listSubscriptions = function (platform, topic, msgtype, servicename) {
        platform = platform || $scope.search.datasource;
        topic = topic || $scope.search.topic;
        msgtype = msgtype || $scope.search.messagetype;
        $scope.service.getSubscribeSettings(platform, topic, msgtype, servicename).then(function (data) {
            //group data by groupId
            var swap = data.reduce(function (array, item) {
                var platform = item.Platform.trim();
                var topic = item.Topic.trim();
                var msgtype = item.MsgType.trim();

                if (array[item.GroupId]) {
                    var e = array[item.GroupId];

                    if (e.Platforms.indexOf(platform) < 0) {
                        e.Platforms.push(platform);
                        e.PlatformsText.push($rootScope.CONST.ALL_ENABLED_PLARFORMS[platform] || platform);
                    }
                    if (e.Topics.indexOf(topic) < 0) {
                        e.Topics.push(topic);
                        e.TopicsText.push(topic);
                    }
                    if (e.MsgTypes.indexOf(msgtype) < 0) {
                        e.MsgTypes.push(msgtype);
                        e.MsgTypesText.push($rootScope.CONST.MESSAGE_TYPES[msgtype] || msgtype);
                    }
                } else {
                    array[item.GroupId] = {
                        GroupId: item.GroupId,
                        EMail: item.EMail,
                        Platforms: [platform],
                        PlatformsText: [$rootScope.CONST.ALL_ENABLED_PLARFORMS[platform] || platform],
                        Topics: [topic],
                        TopicsText: [topic],
                        MsgTypes: [msgtype],
                        MsgTypesText: [$rootScope.CONST.MESSAGE_TYPES[msgtype] || msgtype],
                        ServiceName: item.ServiceName,
                        IsEnabled: item.IsEnabled
                    };
                }
                return array;
            }, {});
            $scope.subscriptions = Object.keys(swap).map(function (groupId) {
                var e = swap[groupId];
                return {
                    GroupId: e.GroupId,
                    EMail: e.EMail,
                    Platform: e.PlatformsText.join(', '),
                    Topic: e.TopicsText.join(', '),
                    MsgType: e.MsgTypesText.join(', '),
                    PlatformArrayJson: JSON.stringify(e.Platforms),
                    TopicArrayJson: JSON.stringify(e.Topics),
                    MsgTypeArrayJson: JSON.stringify(e.MsgTypes),
                    ServiceName: e.ServiceName,
                    IsEnabled: e.IsEnabled
                }
            });
        })
    }
    $scope.listSubscriptions();
    $scope.$watch("selectedPlatform", function (nv, ov) {
        switch ($scope.selectedPlatform) {
            case 'sf':
            case 'su':
            case 'so':
                $scope.tagsCfg = 'stackExchange';
                break;
            case 'twitter':
                $scope.tagsCfg = 'twitter';
                break;
            case 'msdn':
            case 'tn':
                $scope.tagsCfg = 'msdn';
                break;
        }
    })
}