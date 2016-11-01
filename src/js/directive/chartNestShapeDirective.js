/*
    ==========example====================

*/
module.exports = function ($rootScope) {
    return {
        restrict: 'A',
        scope: {
            platform: "@"
        },
        link: function (scope, e, a) {
            var lastTime = new Date();
            var leftButton = angular.element(e.find(".ui.left.icon.button")[0]),
                rightButton = angular.element(e.find(".ui.right.icon.button")[0]);
            var flipLeft = function () {
                var current = new Date();
                if (current.getTime() - lastTime.getTime() < 1000) {
                    return false;
                }
                lastTime = current;
                // debugger;
                if (e.find('.nested')) {
                    var root = e.find('div.side.root').not('.active');
                    var leaf = $(root).find('.sides>.side').get(0);
                    $("#nested_" + scope.platform).shape('flip left');
                            // console.log(root)
                            // console.log(leaf)
                    $(root).find('.ui.shape').shape('set next side', $(leaf)).shape('flip left');
                    // $(leaf).addClass('active');
                    resizeNestChart(leaf);
                } else {
                    $(e.find("div.shape").get(0)).shape('flip left');
                    var cate = e.find("div.side.active").next().attr("page");
                    if (!cate) {
                        var dom = e.find(".side.active").siblings();
                        cate = $(dom[0]).attr("page");
                    }
                    scope.category = cate;
                    $('#' + id + ' .ui.dropdown').dropdown("set text", cate);
                    callMentionedService();
                    resizeChart();
                }
            }
            var flipRight = function () {
                var current = new Date();
                if (current.getTime() - lastTime.getTime() < 1000) {
                    return false;
                }
                lastTime = current;

                $("#nested_" + scope.platform).shape('flip right');
                resizeChart();
            }

            leftButton.bind("click", function (e) {
                e.stopPropagation();
                flipLeft()
            });
            rightButton.bind("click", function (e) {
                e.stopPropagation();
                flipRight()
            });

            function resizeChart() {
                var dom = e.find(".side.active").next().find(".echart");
                if (!dom.get(0)) {
                    dom = e.find(".side.active").siblings();
                    dom = $(dom[0]).find('.echart');
                }
                if (dom.length) {
                    echarts.getInstanceByDom(dom.get(0)).resize();
                }
            }
            function resizeNestChart(leaf) {
                // debugger; 
                var dom = $(leaf).find("div.echart");
                console.log(dom)
                if (!dom.get(0)) {
                    dom = e.find('div.side.root.active').siblings();
                    dom = $(dom[0]).find('.echart');
                }
                if (dom.length) {
                    echarts.getInstanceByDom(dom.get(0)).resize();
                }
            }
        }
    }
}