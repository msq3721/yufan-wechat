var express = require('express');
var router = express.Router();
var auth = require('../service/auth');//验证方式模块
var messages = require('../service/messages');//消息回复模块
var wechat = require('wechat');//消息接口中间件
var API = require('wechat-api');//微信api主动调用
var menu =require('../service/menu.json');
var fs = require('fs');
const model = require('../../model');

/* GET  listing. */
router.get('/tok2',function(req,res,next){
    auth.sign2(req,res,next);
});
router.get('/yz', function(req, res, next) {
    let url = auth.client.getAuthorizeURL('http://16xx318089.imwork.net/wx/index','shome','snsapi_userinfo');
    res.redirect(url);
});
router.get('/articleyz', function(req, res, next) {
    let url = auth.client.getAuthorizeURL('http://16xx318089.imwork.net/wx/index','articlepage','snsapi_userinfo');
    res.redirect(url);
});
router.get('/urlyz', function(req, res, next) {
    let action  = req.query.action
    let url = auth.client.getAuthorizeURL('http://16xx318089.imwork.net/wx/index',action,'snsapi_userinfo');
    res.redirect(url);
});
router.get('/index', function(req, res, next) {
    var client = auth.client;
    auth.getOpenid(req,res,next);
});
//开发模式验证
router.get('/tok',function(req,res,next){
    auth.sign(req,res,next);
});


router.use('/tok2', wechat(auth.config).text(function (message, req, res, next) {
    // TODO
    messages.textReply1(message,req,res,next);
}).event(function (message, req, res, next) {
    // TODO
    messages.eventReply1(message,req,res,next);
}).location(function(message, req, res, next) {
    console.log(message);
}).middlewarify());
//初始化获取token
var api = auth.api;
router.get('/xx', function(req, res, next) {
    let myname = '马首群';
    api.getMaterials('news', 0, 5, function(err,result,resp){
        if(err)
          return console.log('err');
        res.json(result);
    });
});
//创建菜单
api.createMenu(menu, function(err, result){
    console.log(menu);
    console.log(result);
});

module.exports = router;
