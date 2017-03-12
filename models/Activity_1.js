/**
 * Created by M on 2017/2/26.
 */
/**
 * Created by M on 2017/2/4.
 */
const db = require('../db');
module.exports = db.defineModel('activity_1', {
    userid: db.STRING(100),
    type: {
        defaultValue:1,//默认为1
        type:db.INTEGER,
    },
    praise:{
        defaultValue:0,//默认为0点赞数
        type:db.INTEGER,//
    } ,
    isexchanged:{
        defaultValue:0,//默认为0未兑换 1已兑换
        type:db.INTEGER,//
    },
    from:{
       type:db.STRING(20)
    }
});