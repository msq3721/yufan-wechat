/**
 * Created by M on 2017/2/5.
 */
const db = require('../db');

module.exports = db.defineModel('order', {
    userid:db.STRING(100),
    addressid: db.STRING(100),
    totoalprice:{//总价
        type:db.DOUBLE,
    },
    cashfee:{
       type:db.STRING(100),
        allowNull:true
    },//实际付款
    tradeno:{
        type:db.STRING(100),
        allowNull:true
    },//自定义交易号
    transaction:{
        type:db.STRING(100),
        allowNull:true
    },//微信流水号
    couponsid:db.STRING(40),
    discountprice:{
        type:db.DOUBLE,
        defaultValue:0
    }
    ,
    type:{
        type:db.INTEGER//1早餐 2 午晚餐 3 轻食
    },
    status:{
        type:db.INTEGER,// 1 用户下单成功 2 制作中 3 配送中 4 完成订单 5 取消未退款 6 取消已退款
        defaultValue:1
    },
    ordertime:{
        type: db.DATE,
        defaultValue: db.now
    },
    affirmtime:{
        type:db.DATE,
        allowNull:true
    },
    deliverytime:{
        type:db.STRING(50),
        allowNull:true
    },
    flavor:{type:db.STRING(100),allowNull:true}
    ,
    flavorremark:{type:db.STRING(100),allowNull:true}
    ,
    city: {
        defaultValue:'常州',
        type:db.STRING(50),
    },
    district:{
        defaultValue:'武进区',
        type:db.STRING(50),//区
    } ,
    //area:db.STRING(50),//支持配送区域
    site: db.STRING(100),//用户填写的具体位置
    remark:{
        type:db.STRING(200),
        allowNull:true
    },//地址备注
    mobile:{
        type:db.STRING(20),
    },
    name:db.STRING(20),
    sex:db.INTEGER//1 男 0女

});
