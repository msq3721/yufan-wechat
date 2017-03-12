/**
 * Created by M on 2017/3/11.
 */
var express = require('express');
var router = express.Router();
const fs = require('fs');
var formidable = require('formidable');
const uuid = require('node-uuid');
const sub  = require('../../app_weixinsub/service/auth');
const model = require('../../model');
const timeutils = require('../../tools/timeutils');
const qrcode = model.Qrcode;
router.get('/qrcodepage', function (req, res, next) {
    res.render('backstage/promoter/Qrcode', {title: '添加二维码'})
});
router.get('/qrcode', function (req, res, next) {
    let sceneId=req.query.sceneId;
    let name = req.query.name;
    sub.api.createTmpQRCode(sceneId,2592000,(err,result)=>{
        qrcode.create({sceneId:sceneId,expire:2592000,ticket:result.ticket,name:name}).then((r)=>{
            console.log(r);
            res.render('backstage/promoter/Qrcode', {title: '添加二维码'})
        })
    });

});
router.get('/qrcodelistpage', function (req, res, next) {
    qrcode.findAll().then((r)=>{
        res.render('backstage/promoter/QrcodeList', {title: '推广人列表',rr:r});
    });

});

module.exports = router;