/**
 * Created by M on 2017/2/5.
 */
const db = require('../db');
module.exports = db.defineModel('product', {
    foodid:db.STRING(100),
    foodnum:db.INTEGER,
    orderid:db.STRING(100),
    name: db.STRING(100),//名称
    abstract: db.STRING(100),//摘要
    type:db.INTEGER,//1早饭，2，午晚餐 3，轻食
    balance:{//金额
        type:db.DOUBLE,
    },
    imgurl:db.STRING(230),

});