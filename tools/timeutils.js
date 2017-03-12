/**
 * Created by M on 2017/2/17.
 */
const moment = require('moment');
const timeutils = {};
var formatDate = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};
var formCHDate = (date)=>{
    moment.locale('zh-cn');
    let t = moment(date).format('l');
    return t;
};
timeutils.formCHDate =formCHDate;
timeutils.formatDate = formatDate;
module .exports = timeutils;