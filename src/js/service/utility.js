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
        }
    }
};