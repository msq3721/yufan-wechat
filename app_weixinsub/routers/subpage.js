/**
 * Created by M on 2017/1/31.
 */
var express = require('express');
var router = express.Router();
const model = require('../../model');
/* GET home page. */
router.get('/dbinit', function(req, res, next) {
    model.sync();

    console.log('init db ok.');
    res.render('index', { title: 'OK' });
});
router.get('/insfood', function(req, res, next) {
    let fl = model.Foodlist;
    fl.create({
        name:'蘑菇叉烧包',
        abstract:'红豆豆浆+玉米沙拉',
        type:1,
        imgurl:'/aui/image/q2.jpg',
        balance:'10',
        pageurl:'zanwu',
        startdate:'2017-02-02',
        enddate:'2017-02-016',
    }).then(function (p) {
        console.log('created1.' + JSON.stringify(p));
    }).catch(function(err){
        console.log(err)
    });
    fl.create({
        name:'海苔餐包',
        abstract:'水果茶+黑胡椒煎蛋',
        type:1,
        imgurl:'/aui/image/q1.jpg',
        balance:'15',
        pageurl:'zanwu',
        startdate:'2017-02-02',
        enddate:'2017-02-016',
    }).then(function (p) {
        console.log('created1.' + JSON.stringify(p));
    });
    fl.create({
        name:'海苔餐包',
        abstract:'水果茶+黑胡椒煎蛋',
        type:1,
        imgurl:'/aui/image/q3.jpg',
        balance:'25',
        pageurl:1,
        startdate:'2017-02-02',
        enddate:'2017-02-016',
    }).then(function (p) {
        console.log('created1.' + JSON.stringify(p));
    });
    res.render('index', { title: 'OK' });
});
router.get('/insdinner', function(req, res, next) {
    let fl = model.Foodlist;
    fl.create({
        name:'午餐1',
        abstract:'红豆豆浆+玉米沙拉',
        type:1,
        imgurl:'/aui/image/q2.jpg',
        balance:'17',
        pageurl:'zanwu',
        startdate:'2017-02-02',
        enddate:'2017-02-016',
    }).then(function (p) {
        console.log('created1.' + JSON.stringify(p));
    }).catch(function(err){
        console.log(err)
    });
    fl.create({
        name:'午餐2',
        abstract:'水果茶+黑胡椒煎蛋',
        type:1,
        imgurl:'/aui/image/q1.jpg',
        balance:'15',
        pageurl:'zanwu',
        startdate:'2017-02-02',
        enddate:'2017-02-016',
    }).then(function (p) {
        console.log('created1.' + JSON.stringify(p));
    });
    fl.create({
        name:'午餐3',
        abstract:'水果茶+黑胡椒煎蛋',
        type:1,
        imgurl:'/aui/image/q3.jpg',
        balance:'25',
        pageurl:1,
        startdate:'2017-02-02',
        enddate:'2017-02-016',
    },{
        name:'午餐4',
        abstract:'水果茶+黑胡椒煎蛋',
        type:1,
        imgurl:'/aui/image/q1.jpg',
        balance:'55',
        pageurl:1,
        startdate:'2017-02-02',
        enddate:'2017-02-016',
    },{
        name:'午餐5',
        abstract:'水果茶+黑胡椒煎蛋',
        type:1,
        imgurl:'/aui/image/q2.jpg',
        balance:'25',
        pageurl:1,
        startdate:'2017-02-02',
        enddate:'2017-02-016',
    }).then(function (p) {
        console.log('created1.' + JSON.stringify(p));
    });
    res.render('index', { title: 'OK' });
});
router.get('/addtestaddress', function(req, res, next) {
    let fl = model.Address;
    fl.create({
        openid:'oOgjuwS0wrncFsLXifyWGzV4jFA8',
        area:'常州大学',
        site:'图书馆',
        mobile:'15189762381',
        name:'马首群',
        sex:1
    }).then(function (p) {
        fl.create({
            openid:'oOgjuwS0wrncFsLXifyWGzV4jFA8',
            area:'轻工学院',
            site:'图书馆',
            mobile:'15189762520',
            name:'娜娜',
            sex:1
        });
        console.log('created1.' + JSON.stringify(p));
        res.render('index', { title: 'OK' });
    });


});
router.get('/inscoupons', function(req, res, next) {
    let a = model.Coupons;
    a.create({
        code:'vLWcha',
        discount:8,
        startdate:'2017-03-02',
        enddate:'2017-04-02',
    });
    a.create({
        code:'2WajyB',
        discount:8,
        startdate:'2017-03-02',
        enddate:'2017-04-02',
    });
    a.create({
        code:'aKkhkU',
        discount:8,
        startdate:'2017-03-02',
        enddate:'2017-04-02',
    });
    a.create({
        code:'1jtNlZ',
        discount:5,
        startdate:'2017-03-02',
        enddate:'2017-04-02',
    });
    a.create({
        code:'arx4SV',
        discount:5,
        startdate:'2017-03-02',
        enddate:'2017-04-02',
    });
    a.create({
        code:'FYozEn',
        discount:2,
        startdate:'2017-03-02',
        enddate:'2017-04-02',
    });



});
////主页
//router.get('/home', function(req, res, next) {
//    console.log('OK');
//    res.render('sub/home', { title: '遇饭' });
//});
////个人页
//router.get('/my', function(req, res, next) {
//    console.log('OK');
//    res.render('sub/my', { title: '遇饭' });
//});
////订单页面
//router.get('/order', function(req, res, next) {
//    console.log('OK');
//    res.render('sub/order', { title: '遇饭' });
//});
module.exports = router;