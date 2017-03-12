/**
 * Created by M on 2017/3/11.
 */
const db = require('../db');
module.exports = db.defineModel('qrcodehas', {
    sceneId:db.INTEGER,//场景值ID
    openid:db.STRING(100),//
});