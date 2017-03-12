/**
 * Created by M on 2017/3/10.
 */
const db = require('../db');
//现金抵用优惠券
module.exports = db.defineModel('coupons_grant', {
    userid:{
        type:db.STRING(100),
        allowNull:true
    },
    status:{
        type:db.INTEGER, //1 外部发放2 内部领用 3已添加至用户 4已使用 //11 第一次外部发放
    }
});
