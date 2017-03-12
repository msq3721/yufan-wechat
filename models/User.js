/**
 * Created by M on 2017/2/2.
 */
const db = require('../db');

module.exports = db.defineModel('userinfo', {
    openid: {//微信openid
        type:db.STRING(100),
        unique:true,
     },
    nickname: {//昵称
        type:db.STRING(100),
        allowNull: true
    },
    sex: db.INTEGER,
    language: {//语言
        type:db.STRING(100),
        allowNull: true
    },
    city: {//城市
        type:db.STRING(100),
        allowNull: true
    },
    province:{//省
        type:db.STRING(100),
        allowNull: true
    },
    country:{//国家
        type:db.STRING(100),
        allowNull: true
    },
    balance:{//余额
        type:db.DOUBLE,
        defaultValue:0.00
    },
    point:{//积分
        type:db.INTEGER,
        defaultValue:0
    },
    headimgurl:db.STRING(230),
});
