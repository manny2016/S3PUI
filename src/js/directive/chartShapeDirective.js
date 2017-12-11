/*
    ==========example====================

*/
module.exports = function ($rootScope) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, e, a) {
            var id = a.id;
            // e.find("div.shape").shape({
            //     onChange:function(s){
            //     }
            // })
            var lastTime = new Date();
            scope.category = 'twitter';
            $('#' + id + ' .ui.dropdown').dropdown({
                onChange: function (value, text, $selectedItem) {
                    scope.category = value;
                    var selector = "div.side[page='" + value + "']";
                    // var shapSelector = $selectedItem.parent().parent().parent().siblings().find(selector);
                    e.find("div.shape").shape('set next side', selector).shape('flip up')
                    var dom = e.find(selector).find(".echart");
                    callMentionedService();
                    echarts.getInstanceByDom(dom.get(0)).resize();
                }
            });
            var leftButton = angular.element(e.find(".ui.left.icon.button")[0]),
                rightButton = angular.element(e.find(".ui.right.icon.button")[0]),
                cateInput = angular.element(e.find("input:hidden"));
            var flipLeft = function () {
                var current = new Date();
                if (current.getTime() - lastTime.getTime() < 1000) {
                    return false;
                }
                lastTime = current;
                // debugger;
                // if (e.find('.nested')) {
                //     var root = e.find('div.side.root').not('.active');
                //     var leaf = root.find('.sides>.side').get(0);
                //     $(e.find(".nested").get(0)).shape({
                //         onChange: function () {
                //             // debugger;
                //             $(root).find('.ui.shape').shape('set next side', $(leaf)).shape('flip left');
                //             // $(leaf).removeClass('hidden').addClass('active');
                //             resizeNestChart(leaf);
                //         }
                //     }).shape('set next side', $(root)).shape('flip left');
                // } else {
                $(e.find("div.shape").get(0)).shape({
                    onChange: function () {
                        resizeChart();
                    }
                }).shape('flip left');
                var cate = e.find("div.side.active").next().attr("page");
                if (!cate) {
                    var dom = e.find(".side.active").siblings();
                    cate = $(dom[0]).attr("page");
                }
                scope.category = cate;
                var cateDisplay = $rootScope.CONST.ALL_ENABLED_PLARFORMS[cate];
                $('#' + id + ' .ui.dropdown').dropdown("set text", cateDisplay);
                callMentionedService();
                // resizeChart();
                // }
            }
            var flipRight = function () {
                var current = new Date();
                if (current.getTime() - lastTime.getTime() < 1000) {
                    return false;
                }
                lastTime = current;
                e.find("div.shape").shape({
                    onChange: function () {
                        resizeChart();
                    }
                }).shape('flip right');
                var cate = e.find("div.side.active").next().attr("page");
                if (!cate) {
                    var dom = e.find(".side.active").siblings();
                    cate = $(dom[0]).attr("page");
                }
                scope.category = cate;
                var cateDisplay = $rootScope.CONST.ALL_ENABLED_PLARFORMS[cate];
               
                $('#' + id + ' .ui.dropdown').dropdown("set text", cateDisplay);
                callMentionedService();
                // resizeChart();
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
                // debugger;
                var dom = e.find(".side.active").find(".echart");
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
                if (!dom.get(0)) {
                    dom = e.find('div.side.root.active').siblings();
                    dom = $(dom[0]).find('.echart');
                }
                if (dom.length) {
                    echarts.getInstanceByDom(dom.get(0)).resize();
                }
            }
            function callMentionedService() {
                if (a.linkage !== 'true') return;
                $rootScope.$broadcast('fresh-most-mentioned', {
                    platform: scope.category,
                    pnscope: a.pnscope
                })
            }

        }
    }
}