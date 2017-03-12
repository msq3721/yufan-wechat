/**
 * Created by M on 2017/1/31.
 */
var express = require('express');
var router = express.Router();
const model = require('../../model');
const db =require('../../db');
const listDao = require('../dao/listDao');
const insertDao = require('../dao/insertDao');
const session = require('express-session');//sessiion
const sessionServer = require('../service/sessionService');
const funServer =require('../service/funServer');
const updateDao = require('../dao/updateDao');
const findOneDao = require('../dao/findOneDao');
const moment = require('moment');
const uuid = require('node-uuid');
const timeutils = require('../../tools/timeutils');
const auth = require('../service/auth');
const orderService = require('../service/orderService');
const completeOrder = require('../service/completeOrder');
/* 初始化数据库 */
const foodList = model.Foodlist;
const user = model.User;
const activity_1 = model.Activity_1;
const coupons = model.Coupons;
const sign =model.Sign;
/* GET home page. */
//主页 加载食物列表

router.get('/shome', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    let flist = listDao.queryFoodList(function (err, result) {
        if (err)
            return console.log(err);
        for (r of result) {
            r.hasselect = 0;
            for (c of req.session.user.cart) {
                if (r.id === c.id) {
                    r.hasselect = 1;
                }
            }
        }
        res.render('subpro/main/home', {title: '遇饭', flist: result});
    });
});
//回调测试
router.get('/cbt', function (req, res, next) {
    let a = listDao.callb(2, function (err, result) {
        if (err)
            return console.log('dsadasdas');
        console.log(result);
        res.render('sub/hey', {title: 'sd'});
    });
});
//待开发
router.get('/404', function (req, res, next) {
    return res.render('subpro/detail/404', {title: '敬请期待'});
});
//个人页
router.get('/my', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    let now = timeutils.formatDate(new Date());
    coupons.count({where:{userid:req.session.user.userid,status:3,$and:[{'startdate':{$lte: now}},{'enddate':{$gte:now}}]}})
    .then((r)=>{
        res.locals.session = req.session;
        res.render('subpro/main/my', {title: '遇饭',couponsnum:r});
    })

});
//将当前商品添加至购物车(Session)
router.get('/addcart', function (req, res, next) {
    if (!req.session.user) { //如果获取用户session失败
        return res.redirect('/wx/yz');
    }
    findOneDao.findOneFood(req.query.id, (err, r)=> {
        let x = JSON.stringify(r);
        let data = JSON.parse(x);
        sessionServer.AddCartSession(req, data);
        res.redirect('/wx/cart');
    });

});
//改变购物车列表
router.get('/changecart', function (req, res, next) {
    if (!req.session.user) { //如果获取用户session失败
        return  res.redirect('/wx/yz');
    }
    sessionServer.ChangeCartSession(req);
    res.json(req.session.user.totoalprice);
});
//验证早餐和午餐是否在一起
router.get('/verifycart', function (req, res, next) {
    if (!req.session.user) { //如果获取用户session失败
        return   res.redirect('/wx/yz');
    }
    let msg = sessionServer.VerifyCart(req);
    res.json(msg);
});
//加减订单数量
router.get('/changecartcount', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    if (!req.session.user) { //如果获取用户session失败
        return res.redirect('/wx/yz');
    }
    let msg = sessionServer.ChangeCartCount(req, (err, r)=> {
        if (err)
            console.log('callback err');
        r.cartlen = req.session.user.cart.length;
        res.json(r);
    });

});

//router.get('/changecartcounthome', function (req, res, next) {
//    if (!req.session.user) { //如果获取用户session失败
//        return res.redirect('/wx/yz');
//    }
//    let msg = sessionServer.ChangeCartCount(req);
//    res.json(msg);
//});

//购物车
router.get('/cart', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    let now = timeutils.formatDate(new Date());
    coupons.findAll({where:{userid:req.session.user.userid,status:3,$and:[{'startdate':{$lte: now}},{'enddate':{$gte:now}}]},attributes:['id','code','discount','limitprice','startdate','enddate']})
    .then((p)=>{
        res.locals.session = req.session;
        req.session.user.coupons =null;
        res.render('subpro/main/cart', {title: '我的购物车',coupons:p});
    });
});
router.get('/changeconpousbycart', function (req, res, next) {
    if (!req.session.user) { //如果获取用户session失败
        return  res.redirect('/wx/yz');
    }
    if(req.query.id ==='nocoupons'){
        req.session.user.coupons = null;
    }else{
        console.log(req.query.id+'  '+req.query.discount);
        req.session.user.coupons = {id:req.query.id,limitprice:req.query.limitprice,discount:req.query.discount};
        console.log( req.session.user.coupons);
    }
    res.json('OK');
});
//填写订单页面
router.get('/fillorder', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    console.log( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log( req.session.user.coupons);
    res.locals.session = req.session;
    orderService.fillOrder(req,res);

});
router.post('/notify', orderService.middleware(orderService.initConfig).getNotify().done(function(message, req, res, next) {

    console.log(message);//微信返回的数据  
    if(message.return_code == 'SUCCESS' && message.result_code == 'SUCCESS'){
        //这里你可以写支付成功后的操作
    }
}));
//购买下订单
router.get('/buy', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    let a = model.Order;
    let ot = moment().format();//获取当前时间
    let deliverytime = req.query.deliverytime;
    a.create({
        userid: req.session.user.userid,
        addressid: req.session.user.address.id,
        totoalprice: req.query.totoalprice,
        couponsid: req.query.couponsid,
        tradeno: req.query.tradeno,
        discount: req.query.discount,
        type: req.query.type,
        ordertime: ot,
        deliverytime:deliverytime,
        flavor:req.query.flavor,
        flavorremark:req.query.flavorremark,
        city:req.session.user.address.city,
        district:req.session.user.address.district,
        site:req.session.user.address.site,
        remark:req.session.user.address.remark,
        mobile:req.session.user.address.mobile,
        name:req.session.user.address.name,
        sex:req.session.user.address.sex
    }).then((r)=> {//创建订单插入order数据库
        let b = model.Product;
        let d = [];
        for (let x of req.session.user.cart) {
            if (x.checked ===1){
                let now = Date.now();
                let temp = {foodid: x.id,
                    orderid : r.id,
                    foodnum:x.num,
                    name:x.name,
                    abstract:x.abstract,
                    type:x.type,
                    balance:x.balance,
                    imgurl:x.imgurl,
                    id:uuid.v4(),
                    createdAt:now,
                    updatedAt:now,
                    version:0};
                d.push(temp);
            }
        }
        b.bulkCreate(d).then((r2)=> {//批量插入product对应order
            //let c = model.User;
            //let point = parseInt(req.session.user.point) + req.session.user.totoalprice ;
            //console.log(point);//添加对应积分
            //user.update({point:point},{where:{id:req.session.user.userid}})
            //.then(()=>{
            //设置优惠券已经使用
            updateDao.updateHasCoupons(req.session.user.userid,req.query.couponsid,(r)=>{
                //req.session.user.point=point;
                res.json({call:'success'});
            });


            //});
        }).catch((err)=>{
            console.log(err);
            res.json({call:'err'});
        });
    }).catch((err)=>{
        console.log(err);
        res.json({call:'err'});
    });
});
//订单列表
router.get('/order', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
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
    ' WHERE' +
        ' `order`.userid =?' +
    ' ORDER BY `order`.ordertime DESC',
        { replacements: [req.session.user.userid], type: a.QueryTypes.SELECT }).then(function (result) {
        let m= new Map();
        for(let x of result){
            moment.locale('zh-cn');
            x.ordertime = moment(x.ordertime).format('YYYY/MM/DD HH:mm');
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
        console.log(data);
        res.render('subpro/main/order', {title: '遇饭-订单',data:data});
    })

});
//订单详情
router.get('/order', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    let a = db.sequelize;
    a.query('SELECT `order`.addressid,' +
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
        ' WHERE' +
        ' `order`.userid =?' +
        ' ORDER BY `order`.ordertime DESC',
        { replacements: [req.session.user.userid], type: a.QueryTypes.SELECT }).then(function (result) {
        let m= new Map();
        for(let x of result){
            moment.locale('zh-cn');
            x.ordertime = moment(x.ordertime).format('YYYY/MM/DD HH:mm');
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
        console.log(data);
        res.render('subpro/main/order', {title: '遇饭-订单',data:data});
    })

});
//食物详情
router.get('/fooddetail', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    findOneDao.findOneFood(req.query.id, (err, data)=> {
        res.render('subpro/detail/food', {title: data.name, data: data});
    });
});
//口味详情
router.get('/flavor', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    let type = req.query.type;
    findOneDao.findOneFlavor(req.session.user.userid, (err, r)=> {
        res.render('subpro/detail/flavor', {title: '选择口味', call: r.call, data: r.data, type: type});
    });

});
//获取口味
router.get('/getflavor', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    let map = req.query.map;
    let m = JSON.parse(map);
    let type = req.query.type;
    m["userid"] = req.session.user.userid;
    let a = listDao.upsertFlavor(m, function (err, r) {
        if (err) {
            return console.log(err);
        }
        if (type === '1')
            res.redirect('/wx/my');
        else if (type === '2')
            res.redirect('/wx/fillorder')
    })
});
//获取地址列表
router.get('/address', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    let userid = req.session.user.userid;
    let a = listDao.queryAddrssList(userid, function (err, r) {
        if (err) {
            return console.log(err);
        }
        console.log(r);
        res.render('subpro/detail/address', {title: '遇饭-我的地址', list: r});
    });
});
//添加地址方法
router.post('/addaddress', function (req, res, next) {
    if (!req.session.user) {
        return   res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    let isdefault = 1;
    let userid = req.session.user.userid;
    let type = req.query.type;
    if (typeof(req.body.isdefault) == "undefined") { //判断是否填写默认地址
        isdefault = 0;
        let a = insertDao.insertAddress(userid, req.body, isdefault, function (err, r) { //未设置默认地址直接插入
            if (err)
                return console.log(err);
            if (type === '1')
                res.redirect('/wx/address');
            else if (type === '2') {
                res.redirect('/wx/addressselectpage')
            }
        });
    }
    else {
        updateDao.changeAllAddressDefault(userid, (r)=> {//如果设置默认地址则先将原先的清空
            let a = insertDao.insertAddress(userid, req.body, isdefault, function (err, r) {
                if (err)
                    return console.log(err);
                if (type === '1')
                    res.redirect('/wx/address');
                else if (type === '2') {
                    res.redirect('/wx/addressselectpage')
                }
            });
        })
    }
});
//进入修改地址页面
router.get('/modifyaddresspage', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    let id = req.query.id;
    let a = model.Address;
    let type = req.query.type;
    a.findOne({
        where: {id: id}
    }).then((p)=> {
        res.render('subpro/detail/addressmodify', {title: '遇饭-修改地址', p: p, type: type});
    }).catch((err)=> {
    })
});
//修改地址方法
router.post('/modifyaddress', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    let isdefault = 1;
    let id = req.query.id;
    let userid = req.session.user.userid;
    let type = req.query.type;
    console.log('type ==' + type);
    if (typeof(req.body.isdefault) == "undefined") { //判断是否填写默认地址
        isdefault = 0;
        let a = updateDao.updateAddress(id, req.body, isdefault, function (err, r) { //未设置默认地址直接插入
            if (err)
                return console.log(err);
            if (type === '1')
                res.redirect('/wx/address');
            else if (type === '2') {
                res.redirect('/wx/addressselectpage')
            }

        });
    }
    else {
        updateDao.changeAllAddressDefault(userid, (r)=> {//如果设置默认地址则先将原先的清空
            let a = updateDao.updateAddress(id, req.body, isdefault, function (err, r) {
                if (err)
                    return console.log(err);
                if (type === '1')
                    res.redirect('/wx/address');
                else if (type === '2') {
                    console.log('OK');
                    res.redirect('/wx/addressselectpage')
                }
            });
        })
    }
});
//填写订单的地址选择页面
router.get('/addressselectpage', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    let userid = req.session.user.userid;
    let a = listDao.queryAddrssList(userid, function (err, r) {
        if (err) {
            return console.log(err);
        }
        console.log(r);
        res.render('subpro/detail/addressselect', {title: '遇饭-选择订单地址', list: r});
    });
});
//修改订单页面的地址
router.get('/addressselectchange', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    let id = req.query.id;
    let a = model.Address;
    a.findOne({
        where: {id: id}
    }).then((p)=> {
        req.session.user.address = p;
        res.json({call: 1})
    }).catch((err)=> {
    })

});

//文章
router.get('/articlepage', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/articleyz');
    }
    res.locals.session = req.session;
    let a = model.Article;
    a.findAll({order:[['date','DESC']]}).then((p)=> {//加载文章列表
        let today=[];
        let history =[];
        let time = moment();
        for(let i =0;i<p.length;i++){
            let temp = moment(p[i].date);
            p[i].date = timeutils.formCHDate(p[i].date);
            if(time.isSame(temp,'day')){//判断是否为今日文章
                today.push(p[i]);
            }else {
                history.push(p[i]);
            }
        }
        let b =model.Sign;
        b.findAll({where:{userid:req.session.user.userid},order:[['date','DESC']]})
        .then((r)=>{
            let d = funServer.HandleSign(r);
            res.render('subpro/sign/article', {title: '遇饭文章', today: today,history:history,series:d.series,type:d.type,len:d.len});
        });

    }).catch((err)=> {

    })

});
//签到
router.get('/sign', function (req, res, next) {
    let now =moment().format('YYYY-MM-DD');
    let series = parseInt(req.query.series);
    let point =req.session.user.point;
    series++;
    if(series>3){
        point+=3;
    }else{
        point+=2;
    }
    sign.create({userid: req.session.user.userid,date:now,series:series})
    .then(()=>{
        user.update({point:point},{where:{id: req.session.user.userid}})
        .then(()=>{
            req.session.user.point=point;
            res.json("签到成功");
        });

    })
});
//积分
router.get('/pointpage', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    foodList.findAll({where:{type:4},order:[['enddate','DESC']]}).then((p)=>{

        sign.findAll({where:{userid:req.session.user.userid},order:[['date','DESC']]})
            .then((r)=>{
                let d = funServer.HandleSign(r);
                res.render('subpro/detail/giftmall', {title: '遇饭-积分', g:p,series:d.series,type:d.type,len:d.len});
            });
    });
});
//礼物详情
router.get('/giftdetail', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/wx/yz');
    }
    res.locals.session = req.session;
    findOneDao.findOneFood(req.query.id, (err, data)=> {
        res.render('subpro/detail/gift', {title: data.name, data: data});
    });
});
//用积分兑换优惠券
router.get('/bygift', function (req, res, next) {
    let point =req.session.user.point;
    let id = req.query.id;
    let cost;
    let discount;
    switch (id){
        case '1':cost=50;break;
        case '2':cost=100;break;
        case '3':cost=150;break;
    }
    if(id === '1'){
        cost = 50;
        discount = 2;
    }
    else if(id === '2'){
        cost = 100;
        discount = 5;
    }else if(id === '3'){
        cost = 150;
        discount = 8;
    }
    point = point-cost;
    coupons.findOne({where:{userid:null,status:2,discount:discount}})
    .then((r)=>{
        coupons.update({userid:req.session.user.userid,status:3},{where:{id:r.id}})
        .then((r2)=>{
            user.update({point:point},{where:{id: req.session.user.userid}})
                .then(()=>{
                    req.session.user.point=point;
                    res.json("成功兑换此优惠券");
                });
        })
    });
});
//活动
router.get('/activitypage', function (req, res, next) {
    let api =auth.api;
    //api.getTicket((err,result)=>{
    //    console.log(result);
        var param = {
            debug: false,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
            url: 'http://16xx318089.imwork.net/wx/activitypage'
        };
        api.getJsConfig(param,(err,result2)=>{//获取JSSDK验证信息
            foodList.findAll({where:{type:4},order:[['enddate','DESC']]}).then((p)=>{
                activity_1.findOrCreate({where:{userid:req.session.user.userid},defaults:{userid:req.session.user.userid,from:'self'}})
                    .then((q)=>{
                        res.render('subpro/activity/activity', {title: '活动',config:result2,g: p,activitydata:q});
                });

            });
            console.log(result2);

        });
    //});

});
router.get('/activitypageshare', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/urlyz?action=activitypageshare');
    }
    let api =auth.api;
    let shareFrom = req.query.from;
    let userid = req.query.id;
    var param = {
        debug: false,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
        url: 'http://16xx318089.imwork.net/wx/activitypageshare?from='+shareFrom
    };
    api.getJsConfig(param,(err,result2)=>{
        foodList.findAll({where:{type:4},order:[['enddate','DESC']]}).then((p)=>{
                    res.render('subpro/activity/activityshare', {title: '活动',config:result2,g: p,userid:userid});
        });
    });
    //});

});
//点赞
router.get('/praise', function (req, res, next) {

    res.render('subpro/detail/404', {title: '敬请期待'});
});
//优惠券
router.get('/couponspage', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/urlyz?action=couponspage');
    }
    coupons.findAll({where:{userid:req.session.user.userid,status:3},attributes:['code','discount','limitprice','startdate','enddate']})
    .then((p)=>{
        for (let pp of p){
            pp.startdate = timeutils.formCHDate(pp.startdate);
            pp.enddate = timeutils.formCHDate(pp.enddate);
        }
        res.render('subpro/coupons/coupons', {title: '优惠券',p:p});
    });

});

//输入码得到优惠券
router.get('/couponsins', function (req, res, next) {
    updateDao.addCoupons(req.session.user.userid,req.query.coupons,(err,r)=>{
        if(err){
            res.json(0);
        }
        else {
            console.log(r);
            res.json(r);
        }
    })

});

module.exports = router;