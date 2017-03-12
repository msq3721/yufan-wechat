/**
 * Created by M on 2017/2/15.
 */
var express = require('express');
var router = express.Router();
const fs = require('fs');
var formidable = require('formidable');
const model = require('../../model');
const db = require('../../db');
const timeutils = require('../../tools/timeutils');
router.get('/orderlistpage', function (req, res, next) {
    let a = db.sequelize;
    a.query('SELECT `order`.addressid,' +
        '`order`.tradeno,' +
        '`order`.totoalprice,' +
        '`order`.discountprice,' +
        '`order`.type,' +
        '`order`.`status`,' +
        '`order`.ordertime,' +
        '`order`.affirmtime,' +
        '`order`.deliverytime,' +
        '`order`.flavor,' +
        '`order`.flavorremark,' +
        '`order`.city,' +
        '`order`.district,' +
        '`order`.site,' +
        '`order`.remark,' +
        '`order`.mobile,' +
        '`order`.name,' +
        '`order`.sex,' +
        '`order`.id AS orderid,' +
        'product.foodid,' +
        'product.foodnum,' +
        'product.`name`AS productname ,' +
        'product.abstract,' +
        'product.type,' +
        'product.balance,' +
        'product.imgurl,' +
        'product.id AS productid' +
        ' FROM' +
        ' product RIGHT  JOIN `order` ON product.orderid = `order`.id' +
        ' ORDER BY `order`.ordertime DESC',
        { type: a.QueryTypes.SELECT }).then(function (result) {
        let m= new Map();
        for(let x of result){
            x.ordertime = timeutils.formCHDate(x.ordertime);
            if (m.has(x.orderid)){
                m.get(x.orderid).push(x);
            }
            else{
                let temp = [];
                temp.push(x);
                m.set(x.orderid,temp);
            }
        }
        let data = [...m.values()];
        res.render('backstage/order/orderlist', {title: '订单列表',data:data});
    })
});
router.get('/orderbreakfastlistpage', function (req, res, next) {
    let a = db.sequelize;
    console.log(db.generateId());
    a.query('SELECT `order`.addressid,' +
        '`order`.tradeno,' +
        '`order`.totoalprice,' +
        '`order`.discountprice,' +
        '`order`.type,' +
        '`order`.`status`,' +
        '`order`.ordertime,' +
        '`order`.affirmtime,' +
        '`order`.deliverytime,' +
        '`order`.flavor,' +
        '`order`.flavorremark,' +
        '`order`.city,' +
        '`order`.district,' +
        '`order`.site,' +
        '`order`.remark,' +
        '`order`.mobile,' +
        '`order`.name,' +
        '`order`.sex,' +
        '`order`.id AS orderid,' +
        'product.foodid,' +
        'product.foodnum,' +
        'product.`name`AS productname ,' +
        'product.abstract,' +
        'product.type,' +
        'product.balance,' +
        'product.imgurl,' +
        'product.id AS productid' +
        ' FROM' +
        ' product RIGHT  JOIN `order` ON product.orderid = `order`.id' +
        ' ORDER BY `order`.ordertime DESC',
        { type: a.QueryTypes.SELECT }).then(function (result) {
        let m= new Map();
        for(let x of result){
            x.ordertime = timeutils.formCHDate(x.ordertime);
            if (m.has(x.orderid)){
                m.get(x.orderid).push(x);
            }
            else{
                let temp = [];
                temp.push(x);
                m.set(x.orderid,temp);
            }
        }
        let data = [...m.values()];
        res.render('backstage/order/orderlist', {title: '订单列表',data:data});
    })
});
router.get('/changeorder', function (req, res, next) {
});
router.get('/changeorderstatus', function (req, res, next) {
    let id =req.query.id;
    let status =~~req.query.status;
    switch (status){
        case 1: status++;break;
        case 2: status++;break;
        case 3: status++;break;
        case 5: status++;break;
    }
    let a = model.Order;
    a.update({status:status},{where:{id:id}})
    .then((r)=>{
        res.redirect('/bk/orderlistpage');
    })

});
router.get('/taskpage', function (req, res, next) {
    res.render('backstage/order/task', {title: '添加菜品'})
});
router.get('/upfoodpage', function (req, res, next) {
    res.render('backstage/food/upfood', {title: '添加菜品'})
});
//router.post('/upfood', function (req, res, next) {
//    var message = '';
//    var form = new formidable.IncomingForm();   //创建上传表单
//    form.encoding = 'utf-8';        //设置编辑
//    form.uploadDir = 'public/img/foodimg';     //设置上传目录
//    form.keepExtensions = true;     //保留后缀
//    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
//    form.parse(req, function (err, fields, files) {
//        if (err) {
//            console.log(err);
//        }
//
//        var filename = files.resource.name;
//        // 对文件名进行处理，以应对上传同名文件的情况
//        var nameArray = filename.split('.');
//        var type = nameArray[nameArray.length - 1];
//        var name = '';
//        for (var i = 0; i < nameArray.length - 1; i++) {
//            name = name + nameArray[i];
//        }
//        var rand = Math.random() * 100 + 900;
//        var num = parseInt(rand, 10);
//
//        var avatarName = name + num + '.' + type;
//
//        var newPath = form.uploadDir + avatarName;
//        console.log(newPath);
//        // lessonDao.addNewHw(req,res,next,fields,newPath);
//        fs.renameSync(files.resource.path, newPath);  //重命名
//    });
//
//    //res.render('backstage/food/upfood',{title:'上传'})
//});
module.exports = router;