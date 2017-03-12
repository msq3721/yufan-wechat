/**
 * Created by M on 2017/2/22.
 */
const db = require('../db');
module.exports = db.defineModel('sign', {
    userid:db.STRING(100),
    date:db.DATEONLY,
    series:{
        type:db.INTEGER,
        defaultValue: 0,
    }
});