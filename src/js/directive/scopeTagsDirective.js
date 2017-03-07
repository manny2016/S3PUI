module.exports = function () {
    return {
        restrict: 'E',
        templateUrl: 'public/template/scopeTagsEditer.html?time='+new Date().getTime(),
        replace: true,
        link: function (scope, e, a) {
            scope.$watch("selectedTopicIndex", function (nv, ov) {
                if (scope.selectedPlatformIndex && scope.selectedTopicIndex !== '') {
                    // switch (scope.selectedPlatform) {
                    //     case 'sf':
                    //     case 'su':
                    //     case 'so':
                    //         scope.kwds = scope.TopicWithForum[scope.selectedPlatformIndex].topics[scope.selectedTopicIndex].topicsettings.Keywords
                    //         break;
                    //     case 'twitter':
                            scope.kwds = scope.TopicWithForum[scope.selectedPlatformIndex].topics[scope.selectedTopicIndex].topicsettings.Keywords
                    //         break;
                    // }
                }
            })

        },

    }
}