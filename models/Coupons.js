/**
 * Created by M on 2017/2/5.
 */
const db = require('../db');
//现金抵用优惠券
module.exports = db.defineModel('coupons', {
    code: {
        type:db.STRING(100),
        unique:true,

     },
    userid:{
        type:db.STRING(100),
        allowNull:true
    },
    status:{
        type:db.INTEGER,
        defaultValue:1 //1 外部发放2 内部领用 3已添加至用户 4已使用 //11 第一次外部发放
    },
    discount:db.DOUBLE,//折扣金额
    limitprice:{//最低使用金额
        type:db.DOUBLE,
        defaultValue: 0.00,
    },
    startdate:db.DATEONLY,//生效日期
    enddate:db.DATEONLY,//到期日期
});
