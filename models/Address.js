/**
 * Created by M on 2017/2/4.
 */
const db = require('../db');
module.exports = db.defineModel('address', {
    userid: db.STRING(100),
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
    isdefault:{
        type:db.INTEGER,
        defaultValue:0
    },
    name:db.STRING(20),
    sex:db.INTEGER//1 男 0女
});