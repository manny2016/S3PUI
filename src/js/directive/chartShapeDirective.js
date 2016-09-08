/*
    ==========example====================

*/
module.exports = function (testSrv) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, e, a) {
            var id = a.id;
            scope.category = 'twitter'; 
            $('#'+id+' .ui.dropdown').dropdown({
                onChange: function (value, text, $selectedItem) {
                    scope.category = value;
                    var selector = "div.side[page='" + value + "']";
                    // var shapSelector = $selectedItem.parent().parent().parent().siblings().find(selector);
                    e.find("div.shape").shape('set next side', selector).shape('flip up')
                    var dom = e.find(selector).find(".echart");
                    //echarts.getInstanceByDom(dom.get(0)).resize();
                }
            });
            var leftButton = angular.element(e.find(".ui.left.icon.button")[0]),
                rightButton = angular.element(e.find(".ui.right.icon.button")[0]),
                cateInput = angular.element(e.find("input:hidden"));
            var flipLeft = function () {
                e.find("div.shape").shape('flip left');
                var cate = e.find("div.side.active").next().attr("page");
                if(! cate){
                    var dom = e.find(".side.active").siblings();
                    cate = $(dom[0]).attr("page");
                }
                $('#'+id+' .ui.dropdown').dropdown("set text",cate)
                resizeChart();
            }
            var flipRight = function () {
                e.find("div.shape").shape('flip right');
                var cate = e.find("div.side.active").next().attr("page");
                if(! cate){
                    var dom = e.find(".side.active").siblings();
                    cate = $(dom[0]).attr("page");
                }
                $('#'+id+' .ui.dropdown').dropdown("set text",cate)
                resizeChart();
            }
            leftButton.bind("click", flipLeft);
            rightButton.bind("click", flipRight);
            function resizeChart() {
                var dom = e.find(".side.active").next().find(".echart");
                if(!dom.get(0)){
                    dom = e.find(".side.active").siblings();
                    dom = $(dom[0]).find('.echart');
                }
                echarts.getInstanceByDom(dom.get(0)).resize();
            }

        }
    }
}