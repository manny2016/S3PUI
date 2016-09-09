'use strict';

module.exports = function ($filter) {
    return {
        toPercent: function (data, decimal) {
            return parseFloat(parseFloat(data * 100).toFixed(decimal));
        },
        getLastXMonthDate: function(x) {
            var m = new Date();
            m.setDate(1);
            m.setMonth(m.getMonth() - parseInt(x) - 1);
            return m.getFullYear() + "/" + (m.getMonth() + 1) + "/" + m.getDate();
        },
        getTimeRange:function(startDate, endDate, interval,needFormat, format) {
            interval = interval || 1;
            needFormat = needFormat || true,
            format = format || 'yyyy-MM-dd';

            var retVal = [];
            var current = new Date(startDate);

            while (current <= endDate) {
                retVal.push(new Date(current));
                current = (function (d) { d.setDate(d.getDate() +interval ); return d.setHours(0, 0, 0, 0) })(new Date(current));
            }
            if(needFormat){
                retVal = retVal.map(function(date){
                    return $filter('date')(new Date(date),'yyyy-MM-dd')
                })
            }
            return retVal;
        },
        timeToString:function(timestamp){
             return (new Date(timestamp * 1000)).format("yyyy/MM/dd hh:mm");
        }
    }
};

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        // month
        "d+": this.getDate(),
        // day
        "h+": this.getHours(),
        // hour
        "m+": this.getMinutes(),
        // minute
        "s+": this.getSeconds(),
        // second
        "q+": Math.floor((this.getMonth() + 3) / 3),
        // quarter
        "S": this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format) || /(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};