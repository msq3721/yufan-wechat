/**
 * Created by M on 2017/2/27.
 */
const db = require('../db');
module.exports = db.defineModel('activity_1list', {
    userid: db.STRING(100),
    praiseid:db.STRING(100),
});