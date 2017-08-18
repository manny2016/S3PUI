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
        getDateTimeLocaleStringInMinute: function (date) {
            var string = (new Date(date)).toLocaleString();
            var match = /(^[^:]*(:\d+)?)(:\d+)?$/g.exec(string);
            if (match && match.length > 1) {
                return match[1];
            } else {
                return string;
            }
        },
        getTimeRange: function (startDate, endDate, granularity) {
            granularity = granularity || 3;
            var retVal = [];
            var current = new Date(startDate);
            var end = new Date(endDate);
            while (current <= end) {
                retVal.push(current);
                current = new Date(current.valueOf()
                    + (granularity == 2 ? 3600000 : 3600000 * 24));
            }
            return retVal;
        },
        mankindTime2String: function (timestamp) {
            return moment(timestamp * 1000).format("YYYY-MM-DD hh:mm A");
        }
    }
};