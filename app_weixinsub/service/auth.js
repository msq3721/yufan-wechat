/**
 * Created by M on 2017/1/22.
 * 用于验证
 */
const crypto = require('crypto');
const model = require('../../model');
const token = 'yufanthought';
const Oauth = require('wechat-oauth');//用户认证
const session = require('express-session');//sessiion
var API = require('wechat-api');//微信api主动调用
var auth ={};
//服务号变量
//const  config = {
//    token : 'yufanthought',
//    appid : 'wxb0179d0cff0bb8d4',
//    appsecret :'072f2231492777a5b30a49c286bf4bbc',
//    encodingAESKey : 'ao9xlx6L92YvTlODN0THCSUC6G6y7IM4ypxffM4NuYY'
//};
const  config = {
    token : 'yufanthought',
    appid : 'wx2d30fba9eba149ce',
    appsecret :'bc2e379f99759440ae396995a52f8ad8',
    encodingAESKey : 'F7BZyOzHInxoYBZw69bAPh6W0NEZRqfWe1RwEncBtJy',
    mchid: '1445965702'
};
auth.config= config;
var api = new API(config.appid,config.appsecret);
api.getTicket((err,result)=> {
console.log(result);
});
auth.api =api;
var client = new Oauth(auth.config.appid, auth.config.appsecret);
auth.client = client;
//开发模式验证
auth.sign = function(req, res, next){
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = [token,timestamp,nonce];
    array.sort();
    var str = array.toString().replace(/,/g,"");
    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");
    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(code===signature){
        res.send(echostr)
    }else{
        res.send("error");
    }
};
auth.sign2 = function(req, res, next){
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = [token,timestamp,nonce];
    array.sort();
    var str = array.toString().replace(/,/g,"");
    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");
    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(code===signature){
        res.send(echostr)
    }else{
        res.send("error");
    }
};
auth.getOpenid = function(req, res, next) {
    let code = req.query.code;
    let user = model.User;
    client.getAccessToken(code, function (err,result) {
        if(err){
            return console.log('err');
        }
        let accessToken = result.data.access_token;
        let openid = result.data.openid;
        client.getUser(openid, function (err, result) {
            let userInfo = result;
            let cart =[];//购物车放在session中；
            let totoalprice = 0; //购物车总价格
            result.cart=cart;//创建购物车
            result.totoalprice = totoalprice;//更新购物车价格
            res.locals.session = req.session;
            user.findOrCreate({//查找或创建登录用户
                where:{
                    openid:result.openid
                },
                defaults:result
            }).then(function(r){
                result.userid = r[0].id;//更新用户id在session
                result.point=r[0].point;//更新用户积分在session
                req.session.user=result;

                        url = '/wx/'+req.query.state;

                    res.redirect(url);

            });

        });
    });
};

module .exports=auth;