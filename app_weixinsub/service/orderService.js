/**
 * Created by M on 2017/3/8.
 */
const findOneDao = require('../dao/findOneDao');
const listDao = require('../dao/listDao');
const session = require('express-session');//sessiion
const moment = require('moment');
const auth = require('../service/auth');
const model = require('../../model');
const middleware = require('wechat-pay').middleware;
const Payment = require('wechat-pay').Payment;
const fs = require('fs');
const coupons = model.Coupons;

const initConfig = {
    partnerKey: '0a073354e95644219f06e515d0bdmmmm',
    appId: auth.config.appid,
    mchId: auth.config.mchid,
    notifyUrl: "http://16xx318089.imwork.net/wx/notify",
    pfx: fs.readFileSync("public/cert/apiclient_cert.p12")

};
//生成订单流水号=时间+openid前两位Asiic码
var getOrderID = (openid)=>{
    let now = moment();
    let oid = openid.charAt(1).charCodeAt()+openid.charAt(2).charCodeAt();
    console.log('#####################');
    console.log(now.date());
    let str = ''+now.date()+now.month()+now.year()+now.hour()+now.minute()+now.second()+oid;
    return str;
};
const  payment = new Payment(initConfig);
function getjsapi(type,callback){
    var param = {
        debug: false,
        jsApiList: ['chooseWXPay'],
        url: 'http://16xx318089.imwork.net/wx/fillorder?type=?'+type
    };
    let api =auth.api;
    api.getJsConfig(param,(err,result2)=>{//获取JSSDK验证信息
        callback(null, result2);
    });

}
//function couponsHandle(userid,totoalprice,callback){
//    coupons.findAll({where:{userid:userid,status:3,$and:[{discount:{$gte:totoalprice}}]},attributes:['id','code','discount','limitprice','startdate','enddate']})
//        .then((p)=>{
//            let max = 0;
//            let col;
//            for(let i = 0;i<p.length;i++){
//                if(max<p.discount){
//                    max = p.discount;
//                    col =i;
//                }
//            }
//            let result;
//            if(max === 0){
//                result = false;
//            }
//            else{
//                result =p[col];
//            }
//            callback(null,result)
//        });
//}
module.exports ={
    initConfig:initConfig,
    middleware:middleware,
    fillOrder:(req,res)=>{
        let couponsData;
        let totoalprice =req.session.user.totoalprice;
        if(req.session.user.coupons!=null && typeof(req.session.user.coupons)!= "undefined"){
            totoalprice =parseFloat(totoalprice -req.session.user.coupons.discount)  ;
            couponsData = req.session.user.coupons;
            if(totoalprice<=0){
                couponsData.discount = req.session.user.totoalprice-1;
                totoalprice = 1;
            }
        }
        else{
            couponsData = {id:'nocoupons',discount:0};
        }
        console.log( totoalprice);
        let tradeNo = getOrderID(req.session.user.openid);
        const  orderConfig = {  //支付订单参数
            body: '微信支付',
            attach: '微信支付',
            out_trade_no:tradeNo,
            total_fee: totoalprice,
            spbill_create_ip: '127.0.0.1',
            openid: req.session.user.openid,
            trade_type: 'JSAPI'
        };
        console.log(orderConfig);
        let hasaddress = true;
        listDao.queryAddrssList(req.session.user.userid, (err, result)=> {
            if (err)
                return console.log(err);
            if(result<1){//如果未保存过地址
                hasaddress = false;
            }
            else{
                if (typeof(req.session.user.address) === "undefined") {//未使用过地址则使用默认地址
                    let defaultfalg = false;
                    for(let x of result){
                        if(result.isdefault === 1){
                            req.session.user.address = x;
                            defaultfalg = true;
                        }
                    }
                    if(!defaultfalg){
                        req.session.user.address = result[0];//没有默认地址取第一个
                    }

                }
            }

            findOneDao.findFlavorMessage(req.session.user.userid, (err, r,remark)=> {
                if (err) {
                    return console.log('err');
                }
                let type = req.query.type;
                let dd = [];
                let timetype=1; // 1 在配送时间内 2 不在配送时间内
                let now = moment();
                if (type === '2') {
                    if(now.hour()>19||now.hour()<10){
                        timetype=2;
                    }
                }else if (type === '3'){
                    if(now.hour()>19||now.hour()<6){
                        timetype=2;
                    }
                }
                //couponsHandle(req.session.user.userid,req.session.user.totoalprice,(err,p)=>{
                    getjsapi(type,(err,jsConfig)=>{
                        payment.getBrandWCPayRequestParams(orderConfig, function(err, payargs){
                            if(err) {
                                console.log(err);
                            }
                        res.render('subpro/detail/fillorder',
                            {title: '提交订单',
                                flavor: r,
                                flavorremark:remark ,
                                type: type,
                                time: dd,
                                timetype:timetype,
                                hasaddress:hasaddress,
                                config:jsConfig,
                                appId: payargs.appId,
                                timeStamp: payargs.timeStamp,
                                nonceStr: payargs.nonceStr,
                                package: payargs.package,
                                signType: payargs.signType,
                                paySign: payargs.paySign,
                                totoalprice:totoalprice,
                                tradeNo:tradeNo,
                                coupons:couponsData
                            });
                        });
                    });
                //});
            });

        })
    }
};