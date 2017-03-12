/**
 * Created by M on 2017/3/9.
 */
var express = require('express');
var router = express.Router();
const auth = require('../service/auth');
var middleware = require('wechat-pay').middleware;
var Payment = require('wechat-pay').Payment;
const session = require('express-session');//sessiion
const fs = require('fs');
function getjsapi(callback){
    var param = {
        debug: false,
        jsApiList: ['chooseWXPay'],
        url: 'http://16xx318089.imwork.net/wx/payment/a'
    };
    let api =auth.api;
    api.getJsConfig(param,(err,result2)=>{//获取JSSDK验证信息
        callback(null, result2);
    });

}
const getOrderID = (openid)=>{
    let now = moment();
    let oid = openid.charAt(1).charCodeAt()+openid.charAt(2).charCodeAt();
    return now.get('date')+now.get('month')+now.get('year')+now.get('hour')+now.get('minute')+now.get('second')+oid;
};
/* GET home page. */
var initConfig = {
    partnerKey: '0a073354e95644219f06e515d0bdmmmm',
    appId: auth.config.appid,
    mchId: auth.config.mchid,
    notifyUrl: "http://16xx318089.imwork.net/wx/payment/notify",
    pfx: fs.readFileSync("public/cert/apiclient_cert.p12")
};

var get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip;
};
var payment = new Payment(initConfig);
/** 
  * 支付授权 
  * state 传递的参数  
  **/
/** 
  * 支付 
  **/
router.get('/a', function(req, res) {
        var order = {
            body: '微信支付',
            attach: '微信支付',
            out_trade_no:'1111111111132321 ',
            total_fee: 1.00,
            spbill_create_ip: '127.0.0.1',
            openid: 'os7AExIgfOMmwztQYSfthW8A-JqY',
            trade_type: 'JSAPI'
        };

        payment.getBrandWCPayRequestParams(order, function(err, payargs){
            console.log(payargs);
            if(err) {
                console.log(err);
            }
            console.log(payargs);
            getjsapi((err,jsConfig)=> {
                res.render('sub/test', {
                    title: 'pay',
                    appId: payargs.appId,
                    timeStamp: payargs.timeStamp,
                    nonceStr: payargs.nonceStr,
                    package: payargs.package,
                    signType: payargs.signType,
                    paySign: payargs.paySign,
                    config:jsConfig
                });
            })
        });
});
/** 
 * 微信支付回调 
 *（点击支付后微信回调的目录） 
 */
router.post('/notify', middleware(initConfig).getNotify().done(function(message, req, res, next) {
    console.log(message);//微信返回的数据  
    if(message.return_code == 'SUCCESS' && message.result_code == 'SUCCESS'){

        //这里你可以写支付成功后的操作 
        console.log('OK');

    }

}));

module.exports = router;
