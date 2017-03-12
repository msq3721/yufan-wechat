const db = require('../db');

module.exports = db.defineModel('gift', {
    name: db.STRING(100),//名称
    abstract: db.STRING(100),//摘要
    point:{//话费积分
        type:db.INTEGER,
    },
    imgurl:db.STRING(230),
    page:db.TEXT,
});