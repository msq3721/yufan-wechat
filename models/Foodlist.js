const db = require('../db');

module.exports = db.defineModel('foodlist', {
    name: db.STRING(100),//名称
    abstract: db.STRING(100),//摘要
    type:db.INTEGER,//1早饭，2，午晚餐 3，轻食 4,礼物
    balance:{//金额
        type:db.DOUBLE,
    },
    imgurl:db.STRING(230),
    page:db.TEXT,
    startdate:db.DATEONLY,
    enddate:db.DATEONLY,
});
