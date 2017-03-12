/**
 * Created by M on 2017/3/11.
 */
const db = require('../db');
module.exports = db.defineModel('qrcode', {
    sceneId:db.INTEGER,//场景值ID
    expire:db.INTEGER,//过期时间
    ticket:db.STRING(100),//二维码兑换码
    followNum:{type:db.INTEGER,defaultValue:0},//关注数量
    name:{
        type:db.STRING(20)
    }
});