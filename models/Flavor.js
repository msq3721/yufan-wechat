/**
 * Created by M on 2017/2/4.
 */
const db = require('../db');
module.exports = db.defineModel('flavor', {
    userid: {
        unique:true,
        type:db.STRING(100)},
    hot: {
        defaultValue:0,// 辣椒 0正常 1 不吃 2 少放 3 多放
        type:db.INTEGER,
    },
    vinegar: {
        defaultValue:0,// 醋 0正常 1 不吃 2 少放 3 多放
        type:db.INTEGER,
    },
    garlic: {
        defaultValue:0,// 蒜 0正常 1 不吃
        type:db.INTEGER,
    },
    onion: {
        defaultValue:0,// 洋葱 0正常 1 不吃
        type:db.INTEGER,
    },
    scallion: {
        defaultValue:0,// 葱 0正常 1 不吃
        type:db.INTEGER,
    },
    salt: {
        defaultValue:0,// 盐 0正常 1 少放
        type:db.INTEGER,
    },
    rice: {
        defaultValue:0,// 米饭 0正常 2 少放 3 多放
        type:db.INTEGER,
    },
    remark:{
        type:db.STRING(200),
        allowNull:true
    }//备注
});