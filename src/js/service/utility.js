module.exports = function ($filter) {
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getUTCMonth() + 1,
            // month
            "d+": this.getUTCDate(),
            // day
            "h+": this.getUTCHours(),
            // hour
            "m+": this.getUTCMinutes(),
            // minute
            "s+": this.getUTCSeconds(),
            // second
            "q+": Math.floor((this.getUTCMonth() + 3) / 3),
            // quarter
            "S": this.getUTCMilliseconds()
                // millisecond
        };
        if (/(y+)/.test(format) || /(Y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    return {
        toPercent: function (data, decimal) {
            return parseFloat(parseFloat(data * 100).toFixed(decimal));
        },
        getLastXMonthDate: function (x) {
            var m = new Date();
            m.setDate(1);
            m.setUTCMonth(m.getUTCMonth() - parseInt(x) - 1);
            return m.getUTCFullYear() + "/" + (m.getUTCMonth() + 1) + "/" + m.getUTCDate();
        },
        getTimeRange: function (startDate, endDate, interval, needFormat, format) {
            interval = interval || 1;
            needFormat = needFormat || true,
                format = format || 'yyyy-MM-dd';

            var retVal = [];
            var current = new Date(startDate);

            while (current <= endDate) {
                retVal.push(new Date(current));
                current = (function (d) {
                    d.setDate(d.getDate() + interval);
                    return d.setHours(0, 0, 0, 0)
                })(new Date(current));
            }
            if (needFormat) {
                retVal = retVal.map(function (date) {
                    return $filter('date')(new Date(date), 'yyyy-MM-dd')
                })
            }
            return retVal;
        },
        timeToString: function (timestamp, type) {
            var type = type || 'hourly';
            var timeString = '';
            switch (type) {
                case 'hourly':
                    timeString = (new Date(timestamp * 1000)).format("yyyy-MM-dd hh:mm");
                    break;
                case 'daily':
                    timeString = (new Date(timestamp * 1000)).format("yyyy-MM-dd");
                    break;
            }
            return timeString;
        },
        mankindTime2String: function (timestamp) {
            // return (new Date(timestamp * 1000)).format("yyyy/MM/dd hh:mm A");
            return moment(timestamp * 1000).format("YYYY-MM-DD hh:mm A");
        }
    }
};