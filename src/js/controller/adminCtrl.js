module.exports = function ($scope, $location, $state, $timeout, $http, $filter, toastr) {
    // console.log("this is admin");  
    if(!$scope.isAdmin){
        $state.go('home.dashboard');
    }
    $scope.platforms = [];
    $scope.search = {
        datasource: 'all',
        messagetype: 'all',
        topic:'all'
    }

    function generateNewScopeObj(platform) {
        var newScope = {};
        switch (platform) {
            case 'so':
            case 'sf':
            case 'su':
                newScope = {
                    topic: '',
                    stackExchange: {}
                };
                newScope.topic = $scope.newTopicName;
                break;
            case 'twitter':
                newScope = {
                    topic: '',
                    twitter: {}
                };
                newScope.topic = $scope.newTopicName;
                break;
            case 'msdn':
            case 'tn':
                newScope = {
                    topic: '',
                    msdn: {
                        topic: '',
                        Keywords: []
                    }
                };
                newScope.topic = $scope.newTopicName;
                newScope.msdn.topic = $scope.newTopicName;
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
        //         console.log(data)
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
            $scope.platforms = ['twitter', 'so', 'sf', 'su', 'msdn', 'tn']
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
            $('.ui.fluid.dropdown').dropdown();
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
        console.log(e)
    }
    $scope.addKwd = function (event) {
            console.log(event)
            event.stopPropagation();
            var currentTopic = $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex];
            // if(!currentTopic[$scope.tagsCfg].Keywords){
            //     currentTopic[$scope.tagsCfg].Keywords = [];
            // }
            var array = currentTopic[$scope.tagsCfg].Keywords;
            var string = (event.target.value||event.target.previousElementSibling.value).trim()
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
        // console.log($scope.originData);
        // console.log($scope.TopicWithForum);
        // console.log($scope.originData === $scope.TopicWithForum)
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
            $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex][$scope.tagsCfg] = {};
        } else {
            console.log(index);
            var tagCfg = $filter('findObjectInArray')(angular.copy($scope.MsdnTopicMapping), 'topic', index);
            console.log(angular.copy(tagCfg));
            $scope.TopicWithForum[$scope.selectedPlatformIndex].topics[$scope.selectedTopicIndex][$scope.tagsCfg] = angular.copy(tagCfg);
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
                    newScope = generateNewScopeObj($scope.selectedPlatform);
                    switch ($scope.selectedPlatform) {
                        case 'so':
                        case 'sf':
                        case 'su':
                            newScope.stackExchange.Keywords = [];
                            break;
                        case 'twitter':
                            newScope.twitter.Keywords = [];
                            break;
                        case 'msdn':
                        case 'tn':
                            newScope.msdn.Keywords = [];
                            break;
                    }
                    $scope.TopicWithForum[$scope.selectedPlatformIndex].topics.push(newScope)
                    $scope.newTopicName = '';
                    $scope.$digest();
                }
            }
        }).modal('show')

    }
    $scope.init();

    //subscription Operations
    $scope.addNCRule = function ($event) {
        if($event.offsetX === 0){
            return false;
        }
        $('#newSubscription').modal({
            onDeny: function () {
                // return false;
                $scope.initSubscription()
                $('#newSubscription .ui.fluid.dropdown').dropdown('set selected', 'all');
            },
            onApprove: function () {
                if ($scope.newSubscription.email.trim() === '') {
                    toastr.error('Error', 'Email Required!');
                    return false;
                } else {
                    $scope.service.createSubscribe($scope.newSubscription).then(function (data) {
                        if (data == true) {
                            // $scope.subscriptions.unshift($scope.newSubscription);
                            $scope.listSubscriptions();
                            $scope.initSubscription()
                            toastr.success('Success', 'Operation Success!');
                        } else {
                            toastr.error('Error', 'Operation Failed!');
                        }
                    })
                }
            }
        }).modal('show')
    }
    $scope.initSubscription = function () {
        $scope.newSubscription = {
            email: '',
            platform: 'all',
            topic: 'all',
            msgtype: 'all',
            servicename: 'all',
        };
    }
    $scope.removeSubscription = function (entity) {
        $scope.willDelEnt = entity;
        // console.log($scope.subscriptions.indexOf(entity))
        $('#subscriptionDelConfirm').modal({
            onDeny: function () {
                $scope.willDelEnt = undefined;
            },
            onApprove: function () {
                if (entity !== undefined) {
                    $scope.service.deleteSubscribe(entity.Id).then(function (data) {
                        if (data == true) {
                            $scope.subscriptions.splice($scope.subscriptions.indexOf(entity), 1);
                            toastr.success('Success', 'Operation Success!');
                        } else {
                            toastr.error('Error', 'Operation Failed!');
                        }
                    })
                }
            }
        }).modal('show')
    }
    $scope.initSubscription()
    $scope.getTopics = function () {
        $scope.service.getCate().then(function (data) {
            $scope.enabledTopics = data;
        })
    }();
    $scope.listSubscriptions = function (platform, topic, msgtype, servicename) {
        platform = platform || $scope.search.datasource;
        topic = topic || $scope.search.topic;
        msgtype = msgtype || $scope.search.messagetype;
        $scope.service.getSubscribeSettings(platform, topic, msgtype, servicename).then(function (data) {
            $scope.subscriptions = data;
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