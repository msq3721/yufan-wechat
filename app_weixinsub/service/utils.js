/**
 * Created by M on 2017/1/22.
 */
var utils = {};
const config = {
    token : yufanthought,
    token : 'yufanthought',
    appid : 'wxb0179d0cff0bb8d4',
    appsecret :'072f2231492777a5b30a49c286bf4bbc',
    encodingAESKey : 'ao9xlx6L92YvTlODN0THCSUC6G6y7IM4ypxffM4NuYY'
};
var selecttime = ()=>{
    moment.locale('en', {
        weekdays : [
            "星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"
        ]
    });

};
utils.config = config;
module.exports = utils;